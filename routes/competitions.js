const router = require('express').Router(),
      _ = require('lodash'),
      async = require('async'),
      auth = require('../config/auth'),
      handler = require('../utils/handler'),
      { 
        sendRequests, 
        removeRequests,
        sendNotifications,
        replyRequest
      } = require('../utils/requests'),
      { requestTypes, requestEnum } = require('../constants');
const { REQUEST, ACCEPT, REJECT } = requestTypes;

const User = require('../database/user'),
      Competition = require('../database/competition'),
      Request = require('../database/request'),
      Problem = require('../database/problem'),
      Notification = require('../database/notification');

router.post('/', auth.verifyJWT, (req, res) => {
  const { type, action_type, competition, userId, requestId } = req.body;
  if (competition && !competition.name) {
    handler(false, 'Competition name must be filled out.', 400)(req, res);
  }
  switch(type) {
    case REQUEST:
      /* see if contest with same name exists */
      Competition.findOne({ 
        name: { $regex: new RegExp('^' + competition.name.toLowerCase(), 'i') }
      }, (err, existingCompetition) => {
        if (err) {
          handler(false, 'Database failed to load competitions.', 503)(req, res);
        } else if (existingCompetition) {
          return existingCompetition.valid ?
            handler(false, 'A competition with that name already exists.', 400)(req, res) : 
            handler(false, 'A competition with that name is already being requested.', 400)(req, res);
        } else {
          /* create competition */
          let newCompetition = new Competition();
          newCompetition = Object.assign(newCompetition, competition);
          newCompetition = Object.assign(newCompetition, {
            directors: [ req.user._id ] // make requester first director
          });
          newCompetition.save(err => {
            if (err) {
              console.log(err);
              handler(false, 'Database failed to create the competition.', 503)(req, res);
            } else {
              const request = Object.assign(new Request(), {
                author: req.user._id,
                body: `${req.user.name} requests to create the competition \"${competition.name}\".`,
                action_type,
                type: requestEnum.REQUEST,
                competition: newCompetition._id
              });
              User.find({ admin: true }, (err, admins) => {
                /* create request */
                sendRequests(admins, request, req, res, () => {
                  handler(true, 'Successfully requested creation of competition.', 200)(req, res);
                });
              });
            }
          });
        }
      });
      break;
    case ACCEPT:
      if (!req.payload.admin) {
        return handler(false, 'Unauthorized access to requests.', 401)(req, res);
      }
      Request.findById(requestId).populate('competition author').exec((err, request) => {
        if (err) {
          handler(false, 'Competition request was not found.', 503)(req, res);
        } else if (!request.competition) {
          handler(false, 'Competition does not exist.', 400)(req, res);
        } else {
          /* approve competition */
          const approvedCompetition = Object.assign(request.competition, { valid: true });
          approvedCompetition.save(err => {
            if (err) {
              console.log(err);
              handler(false, 'Database failed to approve competition.', 503)(req, res);
            } else {
              User.find({ admin: true }, (err, admins) => {
                const notification = Object.assign(new Notification(), {
                  admin_author: true,
                  title: 'Competition request approved',
                  body: `Your request to create the competition ${approvedCompetition.name} has been approved. You are now the director of this competition.`
                });
                /* send notification to user and remove request from admins */
                replyRequest(admins, request, notification, req, res, () => {
                  handler(true, 'Successfully approved competition.', 200)(req, res);
                });
              });
            }
          });
        }
      });
      break;
    case REJECT:
      if (!req.payload.admin) {
        return handler(false, 'Unauthorized access to requests.', 401)(req, res);
      }
      Request.findById(requestId).populate('competition author').exec((err, request) => {
        if (err) {
          console.log(err);
          handler(false, 'Competition request was not found.', 503)(req, res);
        } else if (!request.competition) {
          handler(false, 'Competition does not exist.', 400)(req, res);
        } else {
          /* delete competition */
          const rejectedCompetition = request.competition;
          request.competition.remove(err => {
            if (err) {
              console.log(err);
              handler(false, 'Failed to remove competition.', 503)(req, res);
            } else {
              User.find({ admin: true }, (err, admins) => {
                const notification = Object.assign(new Notification(), {
                  admin_author: true,
                  title: 'Competition request rejected',
                  body: `Your request to create the competition ${rejectedCompetition.name} has been rejected. Contact the admin for questions.`
                });
                /* send notification to user and remove request from admins */
                replyRequest(admins, request, notification, req, res, () => {
                  handler(true, 'Successfully rejected competiton request.', 200)(req, res);
                });
              });
            }
          });
        }
      });
      break;
    default:
      handler(false, 'Invalid competition post.', 400)(req, res);
      break;
  }
});

router.get('/', (req, res) => {
  Competition.find({ valid: true }, 'name _id', (err, competitions) => {
    if (err) {
      handler(false, 'Database failed to load competitions.', 503)(req, res);
    } else {
      handler(true, 'Successfully loaded competitions.', 200, {
        competitions
      })(req, res);
    }
  });
});

router.post('/join', auth.verifyJWT, (req, res) => {
  const { type, action_type, competition_id, requestId } = req.body;
  switch(type) {
    case REQUEST:
      Competition.findById(competition_id)
      .populate('directors')
      .exec((err, competition) => {
        if (err) {
          console.log(err);
          handler(false, 'Database failed to load competition.', 503)(req, res);
        } else {
          /* check if user is a member yet */
          if (competition.members.indexOf(req.user._id) > -1 ||
              competition.secure_members.indexOf(req.user._id) > -1 ||
              competition.directors.indexOf(req.user) > -1) {
            handler(false, 'User is already a member of the competition.', 400)(req, res);
          } else {
            const request = Object.assign(new Request(), {
              author: req.user._id,
              body: `${req.user.name} requests to join your competition ${competition.name}`,
              action_type: action_type,
              type: requestEnum.REQUEST,
              competition: competition._id
            });
            /* send request to directors */
            sendRequests(competition.directors, request, req, res, () => {
              handler(true, 'Succesfully requested joining of competition.', 200)(req, res);
            });
          }
        }
      });
      break;
    case ACCEPT:
      Request.findById(requestId)
      .populate('author competition')
      .exec((err, request) => {
        if (err) {
          handler(false, 'Database failed to load request.', 503)(req, res);
        } else if (!request.competition) {
          handler(false, 'Competition does not exist.', 400)(req, res);
        } else {
          /* add member to competition and save */
          request.competition.members.push(request.author._id);
          request.competition.save(err => {
            if (err) {
              handler(false, 'Database failed to add member to competition.', 503)(req, res);
            } else {
              User.populate(request.competition, 'directors', (err, competition) => {
                const notification = Object.assign(new Notification(), {
                  admin_author: false,
                  author: request.competition._id,
                  title: 'Competition membership request approved',
                  body: `Your request to join the competition ${request.competition.name} has been approved. You are now a member of the competition and can propose problems to its database.` 
                });
                /* send notification to user and remove request from directors */
                replyRequest(competition.directors, request, notification, req, res, () => {
                  handler(true, 'Succesfully added user to competition.', 200)(req, res);
                });
              });
            }
          });
        }
      });
      break;
    case REJECT:
      Request.findById(requestId)
      .populate('author competition')
      .exec((err, request) => {
        if (err) {
          handler(false, 'Database failed to load request.', 503)(req, res);
        } else if (!request.competition) {
          handler(false, 'Competition does not exist.', 400)(req, res);
        } else {
          User.populate(request.competition, 'directors', (err, competition) => {
            const notification = Object.assign(new Notification(), {
              admin_author: false,
              author: request.competition._id,
              title: 'Competition membership request rejected',
              body: `Your request to join the competition ${request.competition.name} has been rejected. Contact the directors of the competition for details.` 
            });
            /* send notification to user and remove request from directors */
            replyRequest(competition.directors, request, notification, req, res, () => {
              handler(true, 'Succesfully added user to competition.', 200)(req, res);
            });
          });
        }
      });
      break;
    default:
      handler(false, 'Invalid join competition post.', 400)(req, res);
  }
});

router.get('/database', auth.verifyJWT, (req, res) => {
  const { id } = req.query;
  Competition.findById(id, (err, competition) => {
    if (err) {
      console.log(err);
      handler(false, 'Failed to load competition.', 503)(req, res);
    } else if (!competition) {
      handler(false, 'Could not find competition.', 400)(req, res);
    } else if (!(competition.directors.indexOf(req.user._id.toString()) > -1) &&
        !(competition.secure_members.indexOf(req.user._id.toString()) > -1)) {
      handler(false, 'Only directors and secure members can see the database.', 401)(req, res);
    } else {
      Problem.find({ competition: competition._id }, (err, problems) => {
        if (err) {
          handler(false, 'Failed to load database problems.', 503)(req, res);
        } else {
          handler(true, 'Succesfully loaded database problems.', 200, { competition, problems })(req, res);
        }
      });
    }
  });
});

module.exports = router;
