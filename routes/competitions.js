const router = require('express').Router(),
      _ = require('lodash'),
      async = require('async'),
      auth = require('../config/auth'),
      handler = require('../utils/handler'),
      { requestTypes, requestEnum } = require('../constants');
const { REQUEST, ACCEPT, REJECT } = requestTypes;

const User = require('../database/user'),
      Competition = require('../database/competition'),
      Request = require('../database/request'),
      Notification = require('../database/notification');

router.post('/', auth.verifyJWT, (req, res) => {
  const { type, competition, userId, requestId } = req.body;
  console.log(competition);
  if (competition && !competition.name) {
    return handler(false, 'Competition name must be filled out.', 400)(req, res);
  }
  switch(type) {
    case REQUEST:
      /* see if contest with same name exists */
      Competition.findOne({ 
        name: { 
          $regex: new RegExp('^' + competition.name.toLowerCase(), 'i')
        }
      }, (err, existingCompetition) => {
        if (err) {
          return handler(false, 'Database failed to load competitions.', 503)(req, res);
        } else if (existingCompetition) {
          return existingCompetition.valid ?
            handler(false, 'A competition with that name already exists.', 400)(req, res) : 
            handler(false, 'A competition with that name is already being requested.', 400)(req, res);
        } else {
          /* find user who requested competition */
          User.findById(userId, (err, user) => {
            if (err) {
              return handler(false, 'Database failed to load author.', 503)(req, res);
            } else if (!user) {
              return handler(false, 'Author of competition request could not be found.', 400)(req, res);
            } else {
              /* create competition */
              let newCompetition = new Competition();
              newCompetition = Object.assign(newCompetition, competition);
              newCompetition = Object.assign(newCompetition, {
                directors: [ user._id ] // make requester first director
              });
              newCompetition.save(err => {
                if (err) {
                  console.log(err);
                  return handler(false, 'Database failed to create the competition.', 503)(req, res);
                } else {
                  /* create request */
                  const request = Object.assign(new Request(), {
                    author: user._id,
                    body: `${user.name} requests to create the competition \"${competition.name}\".`,
                    type: requestEnum.REQUEST,
                    competition: newCompetition._id
                  });
                  request.save(err => {
                    if (err) {
                      console.log(err);
                      return handler(false, 'Database failed to create the request.', 503)(req, res);
                    } else {
                      /* send request to admins of the site */
                      User.find({ admin: true }, (err, admins) => {
                        const tasks = admins.map(admin => {
                          return callback => {
                            admin.requests.push(request);
                            admin.save(err => {
                              if (err) callback(err, null);
                              else callback(null, null);
                            });
                          }
                        });
                        async.parallel(tasks, (err, results) => {
                          if (err) {
                            console.log(err);
                            return handler(false, 'Database failed to send request to admins.', 503)(req, res);
                          } else {
                            /* success */
                            return handler(true, 'Successfully requested creation of competition.', 200)(req, res);
                          }
                        });
                      });
                    }
                  });
                }
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
          return handler(false, 'Competition request was not found.', 503)(req, res);
        } else {
          /* approve competition */
          let approvedCompetition = request.competition,
              requestAuthor = request.author;
          approvedCompetition.valid = true;
          approvedCompetition.save(err => {
            if (err) {
              console.log(err);
              return handler(false, 'Database failed to approve competition.', 503)(req, res);
            } else {
              /* remove request from all admins */
              User.find({ admin: true }, (err, admins) => {
                const tasks = admins.map(admin => {
                  return callback => {
                    admin.requests = _.remove(admin.requests, adminRequest => {
                      return adminRequest._id === request._id;
                    });
                    admin.save(err => {
                      if (err) callback(err, null);
                      else callback(null, null);
                    });
                  };
                });
                async.parallel(tasks, (err, results) => {
                  if (err) {
                    console.log(err);
                    return handler(false, 'Database failed to delete request from admins.', 503)(req, res);
                  } else {
                    /* remove request */
                    request.remove(err => {
                      if (err) {
                        console.log(err);
                        return handler(false, 'Database failed to delete request.', 503)(req, res);
                      } else {
                        /* send notification to requester */
                        let notification = new Notification();
                        notification = Object.assign(notification, {
                          admin_author: true,
                          title: 'Competition request approved',
                          body: `Your request to create the competition ${approvedCompetition.name} has been approved. You are now the director of this competition.`
                        });
                        notification.save(err => {
                          if (err) {
                            console.log(err);
                            return handler(false, 'Failed to create notification to requester.', 503)(req, res);
                          } else {
                            requestAuthor.unread.push(notification._id);
                            requestAuthor.save(err => {
                              if (err) {
                                console.log(err);
                                return handler(false, 'Failed to send notification to requester.', 503)(req, res);
                              } else {
                                return handler(true, 'Competition approved.', 200)(req, res);
                              }
                            });       
                          }
                        });
                      }
                    });
                  }
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
          return handler(false, 'Competition request was not found.', 503)(req, res);
        } else {
          /* delete competition */
          let rejectedCompetition = request.competition,
              requestAuthor = request.author;
          request.competition.remove(err => {
            if (err) {
              console.log(err);
              return handler(false, 'Failed to remove competition.', 503)(req, res);
            } else {
              /* remove request from all admins */
              User.find({ admin: true }, (err, admins) => {
                const tasks = admins.map(admin => {
                  return callback => {
                    admin.requests = _.remove(admin.requests, adminRequest => {
                      return adminRequest._id === request._id;
                    });
                    admin.save(err => {
                      if (err) callback(err, null);
                      else callback(null, null);
                    });
                  };
                });
                async.parallel(tasks, (err, results) => {
                  if (err) {
                    console.log(err);
                    return handler(false, 'Database failed to delete request from admins.', 503)(req, res);
                  } else {
                    /* remove request */
                    request.remove(err => {
                      if (err) {
                        console.log(err);
                        return handler(false, 'Database failed to delete request.', 503)(req, res);
                      } else {
                        /* send notification to requester */
                        let notification = new Notification();
                        notification = Object.assign(notification, {
                          admin_author: true,
                          title: 'Competition request rejected',
                          body: `Your request to create the competition ${rejectedCompetition.name} has been rejected. Contact the admin for questions.`
                        });
                        notification.save(err => {
                          if (err) {
                            console.log(err);
                            return handler(false, 'Failed to create notification to requester.', 503)(req, res);
                          } else {
                            requestAuthor.unread.push(notification._id);
                            requestAuthor.save(err => {
                              if (err) {
                                console.log(err);
                                return handler(false, 'Failed to send notification to requester.', 503)(req, res);
                              } else {
                                return handler(true, 'Competition rejected.', 200)(req, res);
                              }
                            });       
                          }
                        });
                      }
                    });
                  }
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
  const { type, competition_id } = req.body;
  switch(type) {
    case REQUEST:
      Competition.findById(competition_id)
      .populate('directors')
      .exec((err, competition) => {
        if (err) {
          console.log(err);
          handler(false, 'Database failed to load competition.', 503)(req, res);
        } else {
          if (competition.members.indexOf(req.user._id) > -1 ||
              competition.secure_members.indexOf(req.user._id) > -1 ||
              competition.directors.indexOf(req.user) > -1) {
            handler(false, 'User is already a member of the competition.', 400)(req, res);
          } else {
            const request = Object.assign(new Request(), {
              author: req.user._id,
              body: `${req.user.name} requests to join your competition ${competition.name}`,
              type: requestEnum.REQUEST,
              competition: competition._id
            });
            request.save(err => {
              if (err) {
                handler(false, 'Database failed to save request.', 503)(req, res);
              } else {
                const tasks = competition.directors.map(director => {
                  return callback => {
                    director.requests.push(request);
                    director.save(err => {
                      if (err) callback(err, null);
                      else callback(null, null);
                    });
                  }
                });
                async.parallel(tasks, (err, results) => {
                  if (err) {
                    handler(false, 'Database failed to send request to directors.', 503)(req, res);
                  } else {
                    handler(true, 'Succesfully requested joining of competition.', 200)(req, res);
                  }
                });
              }
            });
          }
        }
      });
      break;
    default:
      handler(false, 'Invalid join competition post.', 400)(req, res);
  }
});

module.exports = router;
