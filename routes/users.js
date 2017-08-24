const router = require('express').Router(),
      _ = require('lodash'),
      auth = require('../config/auth'),
      handler = require('../utils/handler');

const User = require('../database/user'),
      Problem = require('../database/problem')
      Competition = require('../database/competition');

router.get('/', auth.verifyJWT, (req, res) => {
  const { id } = req.query;
  if (!id) {
    return handler(false, 'Invalid request.', 400)(req, res);
  } else if (id !== req.payload.user_id) {
    return handler(false, 'Unauthorized request for user information.', 401)(req, res);
  } else { 
    User.findById(id)
    .populate('urgent unread read requests')
    .exec((err, user) => {
      if (err) {
        console.log(err);
        return handler(false, 'Database failed to find user.', 503)(req, res);
      } else {
        const { name, email, university, unread, read, urgent, requests } = user;
        return handler(true, 'Successfully retrieved user data.', 200, {
          user: {
            name, email, university, unread, read, urgent, requests
          }
        })(req, res);
      }
    });
  }
});

router.get('/admin', (req, res) => {
  User.find({ admin: true }, 'name email', (err, admins) => {
    if (err) {
      return handler(false, 'Database failed to load admins.', 503)(req, res); } else {
      return handler(true, 'Successfully loaded admins info.', 200, {
        admins: admins
      })(req, res);
    }
  });
});

/* get problems of the user */
router.get('/problems', auth.verifyJWT, (req, res) => {
  Problem.find({ user: req.payload.user_id }, (err, problems) => {
    if (err) {
      return handler(false, 'Database failed to load user\'s problems.', 503)(req, res);
    } else {
      return handler(true, 'Successfully loaded admins info.', 200, {
        problems: problems
      })(req, res);
    }
  });
});

/* get competitions of the user */
router.get('/competitions', auth.verifyJWT, (req, res) => {
  Competition.find({ directors: req.payload.user_id }, (err, directorCompetitions) => {
    if (err) {
      console.log(err);
      return handler(false, 'Database failed to search for director competitions.', 503)(req, res);
    } else {
      directorCompetitions = _.map(directorCompetitions, competition => {
        return { 
          membershipStatus: competition.valid ? 'Director' : 'Pending Director',
          competition: competition
        };
      });
      Competition.find({ members: req.payload.user_id }, (err, memberCompetitions) => {
        if (err) {
          console.log(err);
          return handler(false, 'Database failed to search for member competitions.', 503)(req, res);
        } else {
          memberCompetitions = _.map(memberCompetitions, competition => {
            return {
              membershipStatus: 'Member',
              competition: competition
            };
          });
          return handler(true, 'Succesfully loaded member competitions.', 200, {
            competitions: _.concat(directorCompetitions, memberCompetitions)
          })(req, res);
        }
      });
    }
  });
});

/* get competitions of the user for which the user is a director */
router.get('/director', auth.verifyJWT, (req, res) => {
  Competition.find({ 
    directors: req.payload.user_id, 
    valid: true 
  }, 'name _id', (err, directorCompetitions) => {
    if (err) {
      console.log(err);
      return handler(false, 'Database failed to search for director competitions.', 503)(req, res);
    } else {
      return handler(true, 'Succesfully loaded director competitions.', 200, {
        competitions: directorCompetitions
      })(req, res);
    }
  });
});

module.exports = router;
