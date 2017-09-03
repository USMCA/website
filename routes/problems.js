const router = require('express').Router(),
      _ = require('lodash'),
      async = require('async'),
      auth = require('../config/auth'),
      handler = require('../utils/handler'),
      { requestTypes, requestEnum } = require('../constants');
const { REQUEST, ACCEPT, REJECT } = requestTypes;

const User = require('../database/user'),
      Problem = require('../database/problem'),
      Solution = require('../database/solution');

const problemParam = (problem_id, req, res, callback)  => {
  Problem.findById(problem_id)
  .populate('author', 'name _id')
  .populate('competition', 'short_name _id')
  .populate('official_soln', 'author body updated created')
  .populate('alternate_soln', 'author body updated created')
  .populate('comments', 'author body')
  .exec((err, problem) => {
    if (err) handler(false, 'Failed to load problem.', 503)(req, res);
    else if (!problem) handler(false, 'Problem does not exist.', 400)(req, res);
    else {
      User.populate(problem, {
        path: 'official_soln.author alternate_soln.author comments.author',
        select: 'name'
      }, (err, problem) => {
        if (err) {
          console.log(err);
          return handler(false, 'Database failed to load solution author.', 503)(req, res);
        } else {
          callback(problem);
        }
      });
    }
  });
}

/*******************************************************************************
 * Generic routes.
 ******************************************************************************/

/* info that anyone can see */
router.get('/:problem_id', auth.verifyJWT, (req, res) => {
  problemParam(req.params.problem_id, req, res, problem => {
    handler(true, 'Successfully loaded problem.', 200, { problem })(req, res);
  });
});

router.put('/:problem_id', auth.verifyJWT, (req, res) => {
});

/*******************************************************************************
 * Specific routes.
 ******************************************************************************/

router.post('/test-solve', auth.verifyJWT, (req, res) => {
  const { problem_id, solution } = req.body;
  console.log(req.body);
  if (!solution) handler(false, 'Solution is required.', 400)(req, res);
  problemParam(problem_id, req, res, problem => {
    const testSolveSolution = Object.assign(new Solution(), {
      author: req.user,
      body: solution
    });
    testSolveSolution.save(err => {
      if (err) handler(false, 'Failed to save solution.', 503)(req, res);
      else {
        problem.alternate_soln.push(testSolveSolution);
        problem.save(err => {
          if (err) handler(false, 'Failed to save solution to problem.', 503)(req, res);
          else handler(true, 'Successfully posted test solve.', 200, { 
            alternate_soln: problem.alternate_soln
          })(req, res);
        });
      }
    });
  });
});

router.post('/upvotes', auth.verifyJWT, (req, res) => {
  Problem.findById(req.body.id, (err, problem) => {
    if (err) {
      console.log(err);
      return handler(false, 'Database failed to load problem.', 503)(req, res);
    } else {
      if (_.find(problem.upvotes, upvoteUserId => (upvoteUserId.equals(req.user._id)))){
        problem.upvotes.pull(req.user._id);
      } else {
        problem.upvotes.push(req.user._id);
      }
      problem.save(err => {
        if (err) {
          console.log(err);
          return handler(false, 'Database failed to toggle upvote.', 503)(req, res);
        }
        return handler(true, 'Successfully toggled upvote.', 200, {
          problem
        })(req, res);
      });
    }
  });
});

router.post('/comments', auth.verifyJWT, (req, res) => {
  const { comment, id } = req.body;
});

module.exports = router;
