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
  const { type, action_type, competition, userId, request_id } = req.body;
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
      Request.findById(request_id).populate('competition author').exec((err, request) => {
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
      Request.findById(request_id).populate('competition author').exec((err, request) => {
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

router.post('/invite', auth.verifyJWT, (req, res) => {
  const { type, action_type, user_id, competition_id, request_id } = req.body;
  switch (type) {
    case REQUEST:
      Competition.findById(competition_id, (err, competition) => {
        if (err) handler(false, 'Failed to load competition.', 503)(req, res);
        else if (!competition) handler(false, 'Competition doesn\'t exist.', 400)(req, res);
        else {
          /* only directors can invite users */
          if (competition.directors.indexOf(req.user._id) === -1) {
            handler(false, 'User is not a director of the competition.', 401)(req, res);
          } else {
            User.findById(user_id)
            .populate('requests')
            .exec((err, user) => {
              if (err) handler(false, 'Failed to load user.', 503)(req, res);
              else if (!user) handler(false, 'User doesn\'t exist.', 400)(req, res);
              else {
                /* check if user is a member yet */
                if (competition.members.indexOf(user._id) > -1 ||
                    competition.secure_members.indexOf(user._id) > -1 ||
                    competition.directors.indexOf(user._id) > -1) {
                  handler(false, 'User is already a member of the competition.', 400)(req, res);
                } else {
                  const invite = Object.assign(new Request(), {
                    author: req.user._id,
                    body: `${req.user.name} invites you to join their competition ${competition.name}`,
                    action_type: action_type,
                    type: requestEnum.INVITE,
                    competition: competition._id
                  });
                  /* send invite to user */
                  sendRequests([user], invite, req, res, () => {
                    handler(true, 'Succesfully requested joining of competition.', 200)(req, res);
                  });
                }
              }
            });
          }
        }
      });
      break;
    case ACCEPT:
      Request.findById(request_id)
      .populate('competition')
      .exec((err, invite) => {
        if (err) handler(false, 'Failed to load invite.', 503)(req, res);
        else if (!invite) handler(false, 'Invite does not exist.', 400)(req, res);
        else if (!invite.competition) handler(false, 'Associated competition does not exist.', 400)(req, res);
        else {
          invite.competition.members.push(req.user._id);
          invite.competition.save(err => {
            if (err) handler(false, 'Failed to save competition.', 503)(req, res);
            else {
              invite.remove(err => {
                if (err) handler(false, 'Failed to remove invite.', 503)(req, res);
                else handler(true, 'Successfully accepted invite.', 200)(req, res);
              });
            }
          });
        }
      });
      break;
    case REJECT:
      Request.findByIdAndRemove(request_id, err => {
        if (err) handler(false, 'Failed to reject invite.', 503)(req, res);
        else handler(true, 'Successfully reject invite.', 200)(req, res);
      });
      break;
    default:
      handler(false, 'Invalid request.', 400)(req, res);
  }
});

router.post('/join', auth.verifyJWT, (req, res) => {
  const { type, action_type, competition_id, request_id } = req.body;
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
      Request.findById(request_id)
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
      Request.findById(request_id)
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
  const { id, subject, difficulty } = req.query;
  Competition.findById(id, (err, competition) => {
    if (err) {
      console.log(err);
      handler(false, 'Failed to load competition.', 503)(req, res);
    } else if (!competition) {
      handler(false, 'Could not find competition.', 400)(req, res);
    } else if (!(competition.directors.indexOf(req.user._id.toString()) > -1) &&
        !(competition.czars.indexOf(req.user._id.toString()) > -1) &&
        !(competition.secure_members.indexOf(req.user._id.toString()) > -1)) {
      handler(false, 'Only directors, czars, and secure members can see the database.', 401)(req, res);
    } else {
      let query = { competition: competition._id };
      if (subject) {
        if (subject != 'Other') query.subject = subject;
        else {
          query.subject = {
            //@TODO make this non hard coded
            $nin: ['Algebra', 'Combinatorics', 'Computer Science', 'Geometry', 'Number Theory']
          };
        }
      }
      if (difficulty) query.difficulty = { $in: _.map(difficulty, i => parseInt(i)) }
      Problem.find(query).sort({ updated: -1 }).exec((err, problems) => {
        if (err) {
          handler(false, 'Failed to load database problems.', 503)(req, res);
        } else {
          handler(true, 'Succesfully loaded database problems.', 200, { competition, problems })(req, res);
        }
      });
    }
  });
});

/* changing user permissions */
router.post('/permissions', auth.verifyJWT, (req, res) => {
  const { competition_id, user_id, permission } = req.body;
  Competition.findById(competition_id, (err, competition) => {
    if (err) handler(false, 'Failed to load competition.', 503)(req, res);
    else if (!competition) handler(false, 'Competition does not exist.', 400)(req, res);
    else {
      User.findById(user_id, (err, user) => {
        if (err) handler(false, 'Failed to load user.', 503)(req, res);
        else if (!user) handler(false, 'User does not exist.', 400)(req, res);
        else {
          switch(permission) {
            case "nonmember":
              competition.members.pull(user._id);
              competition.secure_members.pull(user._id);
              competition.czars.pull(user._id);
              competition.directors.pull(user._id);
              break;
            case "member":
              competition.members.push(user._id);
              competition.secure_members.pull(user._id);
              competition.czars.pull(user._id);
              competition.directors.pull(user._id);
              break;
            case "secure_member":
              competition.members.pull(user._id);
              competition.secure_members.push(user._id);
              competition.czars.pull(user._id);
              competition.directors.pull(user._id);
              break;
            case "czar":
              competition.members.pull(user._id);
              competition.secure_members.pull(user._id);
              competition.czars.push(user._id);
              competition.directors.pull(user._id);
              break;
            case "director":
              competition.members.pull(user._id);
              competition.secure_members.pull(user._id);
              competition.czars.pull(user._id);
              competition.directors.push(user._id);
              break;
          }
          competition.save(err => {
            if (err) handler(false, 'Failed to change permission.', 503)(req, res);
            else handler(true, 'Successfully changed permission.', 200)(req, res);
          });
        }
      });
    }
  });
});

module.exports = router;
