const router = require('express').Router(),
      _ = require('lodash'),
      async = require('async'),
      auth = require('../config/auth'),
      handler = require('../utils/handler'),
      { requestTypes, requestEnum } = require('../constants');
const { REQUEST, ACCEPT, REJECT } = requestTypes;

const User = require('../database/user'),
      Competition = require('../database/competition'),
      Contest = require('../database/contest'),
      Test = require('../database/test'),
      Problem = require('../database/problem');

router.post('/', auth.verifyJWT, (req, res) => {
  const { competition_id, name, date, locations } = req.body;
  Competition.findById(competition_id, (err, competition) => {
    if (err) {
      handler(false, 'Database failed to find the associated competition.', 503)(req, res);
    } else if (!competition) {
      handler(false, 'The associated competition does not exist.', 503)(req, res);
    } else {
      if (competition.directors.indexOf(req.user._id) === -1) {
        return handler(false, 'User is not a director of the competition.', 401)(req, res);
      } else {
        const contest = Object.assign(new Contest(), {
          competition: competition._id,
          name: name,
          date: new Date(date),
          locations: locations
        });
        contest.save(err => {
          if (err) {
            console.log(err);
            return handler(false, 'Database failed to save the contest.', 503)(req, res);
          } else {
            competition.contests.push(contest._id);
            competition.save(err => {
              if (err) {
                console.log(err);
                handler(false, 'Database failed to save contest to competition.', 503)(req, res);
              } else {
                handler(true, 'Successfully created the contest.', 200)(req, res);
              }
            });
          }
        });
      }
    }
  });
});

/* get a contest */
router.get('/:contest_id', auth.verifyJWT, (req, res) => {
  const { contest_id } = req.params;
  Contest.findById(contest_id)
  .populate('czars', 'name email')
  .populate('tests')
  .populate('test_solvers', 'name email')
  .exec((err, contest) => {
    if (err) handler(false, 'Failed to load contest.', 503)(req, res);
    else if (!contest) handler(false, 'Contest does not exist.', 400)(req, res);
    else handler(true, 'Succesfully loaded contest.', 200, { contest })(req, res);
  });
});

router.param('test_id', (req, res, next, test_id) => {
  Test.findById(test_id)
  .populate('problems')
  .populate('contest', 'name competition')
  .exec((err, test) => {
    if (err) handler(false, 'Failed to load test.', 503)(req, res);
    else if (!test) handler(false, 'Test does not exist.', 400)(req, res);
    else {
      req.test = test;
      next();
    }
  });
});

/* get a test */
router.get('/tests/:test_id', auth.verifyJWT, (req, res) => {
  handler(true, 'Successfully loaded test.', 200, { test: req.test })(req, res);
});

/* add a problem to a test */
router.post('/tests/:test_id', auth.verifyJWT, (req, res) => {
  const { problem_id } = req.body;
  Problem.findById(problem_id)
  .populate('competition')
  .exec((err, problem) => {
    if (err) handler(false, 'Failed to load problem.', 503)(req, res);
    else if (!problem) handler(false, 'Problem does not exist.', 400)(req, res);
    else {
      /* check if problem belongs to competition */
      if (!problem.competition.equals(req.test.contest.competition)) {
        handler(false, 'The problem does not belong to the competition.', 400)(req, res);
      /* check if problem is in the test already */
      } else if (
        _.find(
          req.test.problems, 
          existingProblem => existingProblem._id.toString() === problem._id.toString()
        )
      ) {
        handler(false, 'The problem is already in the test.', 400)(req, res);
      } else {
        req.test.problems.push(problem);
        req.test.save(err => {
          if (err) handler(false, 'Failed to save test.', 503)(req, res);
          else handler(true, 'Successfully added problem to test.', 200, {
            problem
          })(req, res);
        });
      }
    }
  });
});

/* delete problem from a test */
router.delete('/tests/:test_id', auth.verifyJWT, (req, res) => {
  const { problem_id } = req.body;
  req.test.problems.pull(problem_id);
  req.test.save(err => {
    if (err) handler(false, 'Failed to save test.', 503)(req, res);
    else handler(true, 'Deleted problem from test.', 200)(req, res);
  });
});

/* post a new test */
router.post('/:contest_id/tests', auth.verifyJWT, (req, res) => {
  const { contest_id } = req.params,
        { name, num_problems } = req.body;
  Contest.findById(contest_id)
  .populate('competition', 'directors')
  .exec((err, contest) => {
    if (err) handler(false, 'Failed to load contest.', 503)(req, res);
    else if (!contest) handler(false, 'Contest does not exist.', 400)(req, res);
    else {
      /* check if user is czar (or director) */
      if (contest.czars.indexOf(req.user._id.toString()) === -1 &&
          contest.competition.directors.indexOf(req.user._id.toString()) === -1) {
        handler(false, 'User does not have czar privileges.', 401)(req, res);
      } else {
        const test = Object.assign(new Test(), {
          name, num_problems, contest
        });
        test.save(err => {
          console.log(err);
          if (err) handler(false, 'Failed to save test.', 503)(req, res);
          else {
            contest.tests.push(test);
            contest.save(err => {
              if (err) handler(false, 'Failed to save test to contest.', 503)(req, res);
              else handler(true, 'Succesfully created test.', 200, { test })(req, res);
            });
          }
        });
      }
    }
  });
});

module.exports = router;
