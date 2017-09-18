const router = require('express').Router(),
      _ = require('lodash'),
      async = require('async'),
      auth = require('../config/auth'),
      handler = require('../utils/handler'),
      { requestTypes, requestEnum } = require('../constants'),
      { 
        sendRequests, 
        removeRequests,
        sendNotifications,
        replyRequest
      } = require('../utils/requests'),
      { REQUEST, ACCEPT, REJECT } = requestTypes;

const User = require('../database/user'),
      Competition = require('../database/competition'),
      Contest = require('../database/contest'),
      Test = require('../database/test'),
      Request = require('../database/request'),
      Problem = require('../database/problem'),
      Notification = require('../database/notification');

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
  .populate('tests')
  .populate('test_solvers', 'name email')
  .exec((err, contest) => {
    if (err) handler(false, 'Failed to load contest.', 503)(req, res);
    else if (!contest) handler(false, 'Contest does not exist.', 400)(req, res);
    else handler(true, 'Succesfully loaded contest.', 200, { contest })(req, res);
  });
});

router.param('test_id', (req, res, next, test_id) => {
  /* @TODO check auths */
  auth.verifyJWT(req, res, () => {
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
});

/* get a test */
router.get('/tests/:test_id', (req, res) => {
  handler(true, 'Successfully loaded test.', 200, { test: req.test })(req, res);
});

/* add a problem to a test */
router.post('/tests/:test_id', (req, res) => {
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
router.delete('/tests/:test_id', (req, res) => {
  const { problem_id } = req.body;
  req.test.problems.pull(problem_id);
  req.test.save(err => {
    if (err) handler(false, 'Failed to save test.', 503)(req, res);
    else handler(true, 'Deleted problem from test.', 200)(req, res);
  });
});

/* reorder problems in a test */
router.put('/tests/:test_id', (req, res) => {
  const { problem_ids } = req.body;
  const testProblemIds = req.test.problems.map(problem => problem._id.toString()).sort(),
        newProblemIds = problem_ids.map(problem => problem).sort();
  if (!_.isEqual(testProblemIds, newProblemIds)) {
    handler(false, 'New problems are not a permutation of the test.', 400)(req, res);
  } else {
    req.test.problems = problem_ids;
    req.test.save(err => {
      if (err) handler(false, 'Failed to save test.', 503)(req, res);
      else handler(true, 'Reordered the test.', 200)(req, res);
    });
  }
});

/* post a new test */
router.post('/:contest_id/tests', auth.verifyJWT, (req, res) => {
  const { contest_id } = req.params,
        { name, num_problems } = req.body;
  Contest.findById(contest_id)
  .populate('competition', 'czars directors')
  .exec((err, contest) => {
    if (err) handler(false, 'Failed to load contest.', 503)(req, res);
    else if (!contest) handler(false, 'Contest does not exist.', 400)(req, res);
    else {
      /* check if user is czar (or director) */
      if (contest.competition.czars.indexOf(req.user._id.toString()) === -1 &&
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

/* request test solvers */
router.post('/:contest_id/test-solvers', auth.verifyJWT, (req, res) => {
  const { contest_id } = req.params,
        { requested_test_solvers } = req.body;
  Contest.findByIdAndUpdate(contest_id, { 
    requested_test_solvers 
  }, (err, contest) => {
    if (err) handler(false, 'Failed to load contest.', 503)(req, res);
    else if (!contest) handler(false, 'Contest does not exist.', 400)(req, res);
    else handler(true, 'Updated request for test solvers.', 200)(req, res);
  });
});

/* apply to test solve */
router.post('/test-solve', auth.verifyJWT, (req, res) => {
  let { type, action_type, contest_id, request_id } = req.body;
  Request.findById(request_id)
  .populate('author contest')
  .exec((err, request) => {
    if (err) return handler(false, 'Failed to load request_id.', 503)(req, res);
    else if (request && (type === ACCEPT || type === REJECT)) {
      contest_id = request.contest;
    } else if (!request && type === REQUEST) {
    } else return handler(false, 'Invalid request.', 400)(req, res);
    Contest.findById(contest_id)
    .populate('competition', 'directors czars')
    .exec((err, contest) => {
      if (err) handler(false, 'Failed to load contest.', 503)(req, res);
      else if (!contest) handler(false, 'Contest does not exist.', 400)(req, res);
      else {
        User.populate(contest, 'competition.directors competition.czars', (err, contest) => {
          if (err) handler(false, 'Failed to populate authorities.', 503)(req, res);
          else {
            const authorities = _.concat(contest.competition.directors, contest.competition.czars);
            switch(type) {
              case REQUEST:
                const newRequest = Object.assign(new Request(), {
                  author: req.user._id,
                  body: `${req.user.name} requests to test solve for the contest \"${contest.name}\".`,
                  action_type,
                  type: requestEnum.REQUEST,
                  contest: contest_id
                });
                sendRequests(authorities, newRequest, req, res, () => {
                  handler(true, 'Successfully requested to be a test solver.', 200)(req, res);
                });
                break;
              case ACCEPT:
                contest.test_solvers.push(request.author);
                contest.save(err => {
                  if (err) handler(false, 'Failed to add user as test solver.', 503)(req, res);
                  else {
                    const notification = Object.assign(new Notification(), {
                      admin_author: false,
                      author: contest.competition,
                      title: 'Test Solver request approved',
                      body: `Your request to become a test solver for ${contest.name} has been approved.`
                    });
                    /* send notification to user and delete request from authorities */
                    replyRequest(authorities, request, notification, req, res, () => {
                      handler(true, 'Successfully added user as test solver.', 200)(req, res);
                    });
                  }
                });
                break;
              case REJECT:
                if (!request) handler(false, 'Request does not exist.', 400)(req, res);
                else {
                  const notification = Object.assign(new Notification(), {
                    admin_author: false,
                    author: contest.competition,
                    title: 'Test Solver request rejected',
                    body: `Your request to become a test solver for ${contest.name} has been rejected.`
                  });
                  /* send notification to user and delete request from authorities */
                  replyRequest(authorities, request, notification, req, res, () => {
                    handler(true, 'Successfully rejected user as test solver.', 200)(req, res);
                  });
                }
                break;
              default:
                handler(false, 'Invalid test solve post.', 400)(req, res);
            }
          }
        });
      }
    });
  });
});

module.exports = router;
