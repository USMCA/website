const router = require('express').Router(),
      _ = require('lodash'),
      auth = require('../config/auth'),
      handler = require('../utils/handler');

const User = require('../database/user'),
      Problem = require('../database/problem'),
      Solution = require('../database/solution'),
      Competition = require('../database/competition');

/*******************************************************************************
 * Generic requests
 ******************************************************************************/

const userPopulate = (user, req, res, callback) => {
  user.populate('urgent unread read requests', (err, user) => {
    if (err) handler(false, 'Failed to populate user.', 503)(req, res);
    else {
      Competition.populate(user, {
        path: 'unread.author read.author urgent.author',
        select: 'short_name'
      }, (err, user) => {
        if (err) handler(false, 'Failed to populate user.', 503)(req, res);
        else {
          const { name, email, university, unread, read, urgent, requests } = user;
          callback({ name, email, university, unread, read, urgent, requests });
        }
      });
    }
  });
}

router.get('/', auth.verifyJWT, (req, res) => {
  userPopulate(req.user, req, res, user => {
    handler(true, 'Successfully retrieved user data.', 200, { user })(req, res);
  });
});

router.put('/', auth.verifyJWT, (req, res) => {
  req.user.update(req.body, (err, user) => {
    if (err) handler(false, 'Failed to update user.', 503)(req, res);
    else {
      User.findById(req.user._id, (err, user) => {
        userPopulate(user, req, res, user => {
          handler(true, 'Successfully upated user.', 200, { user })(req, res);
        });
      });
    }
  });
});

/*******************************************************************************
 * Admin
 ******************************************************************************/

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

/*******************************************************************************
 * Problems
 ******************************************************************************/

/* get problems of the user */
router.get('/problems', auth.verifyJWT, (req, res) => {
  Problem.find({ author: req.user._id }, null, { 
    sort: { updated: -1 } 
  }, (err, problems) => {
    if (err) {
      return handler(false, 'Database failed to load user\'s problems.', 503)(req, res);
    } else {
      return handler(true, 'Successfully user\'s problems info.', 200, {
        problems: problems
      })(req, res);
    }
  });
});

/* post a new problem */
router.post('/problems', auth.verifyJWT, (req, res) => {
  const { 
    competition_id, 
    subject, 
    difficulty, 
    statement,
    answer,
    solution
  } = req.body;
  Competition.findById(competition_id, (err, competition) => {
    if (err) {
      console.log(err);
      return handler(false, 'Database failed to load the associated competition.', 503)(req, res);
    } else {
      const official_soln = solution ? Object.assign(new Solution(), {
              author: req.user._id,
              body: solution
            }) : null;
            problem = Object.assign(new Problem(), {
              author: req.user._id,
              competition: competition._id,
              subject,
              difficulty,
              statement, 
              answer,
              official_soln: official_soln ? [ official_soln._id ] : []
            });
      problem.save(err => {
        if (err) {
          console.log(err);
          return handler(false, 'Database failed to save problem.', 503)(req, res);
        } else if (official_soln) {
          official_soln.save(err => {
            if (err) {
              return handler(false, 'Database failed to save solution.', 503)(req, res);
            } else {
              return handler(true, 'Successfully posted problem.', 200)(req, res);
            }
          });
        } else {
          return handler(true, 'Successfully posted problem.', 200)(req, res);
        }
      });
    }
  });
});

/*******************************************************************************
 * Competitions
 ******************************************************************************/

/* get competitions of the user */
router.get('/competitions', auth.verifyJWT, (req, res) => {
  const fields = req.query.info ? null : 'name short_name _id';
  Competition.find({ 
    $or: [
      { directors: req.user._id },
      { secure_members: req.user._id },
      { members: req.user._id }
    ] 
  }, fields)
  .populate(req.query.info ? 'contests members secure_members directors' : null)
  .exec((err, competitions) => {
    if (err) {
      console.log(err);
      handler(false, 'Database failed to search for user competitions.', 503)(req, res);
    } else {
      handler(true, 'Successfully loaded user competitions.', 200, { competitions })(req, res);
    }
  });
});

/* get competitions of the user for which the user is a director */
router.get('/director', auth.verifyJWT, (req, res) => {
  Competition.find({ 
    directors: req.payload.user_id, 
    valid: true 
  }, 'short_name name _id', (err, directorCompetitions) => {
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
