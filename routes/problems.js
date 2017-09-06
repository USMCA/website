const router = require('express').Router(),
      _ = require('lodash'),
      async = require('async'),
      auth = require('../config/auth'),
      handler = require('../utils/handler'),
      { requestTypes, requestEnum } = require('../constants');
const { REQUEST, ACCEPT, REJECT } = requestTypes;

const User = require('../database/user'),
      Problem = require('../database/problem'),
      Solution = require('../database/solution'),
      Comment = require('../database/comment'),
      Competition = require('../database/competition');

const problemParam = (problem_id, req, res, callback)  => {
  Problem.findById(problem_id)
  .populate('author', 'name _id')
  .populate('competition', 'short_name _id')
  .populate('official_soln', 'author body created updated comments upvotes')
  .populate('alternate_soln', 'author body created updated comments upvotes')
  .populate('comments', 'author body created updated')
  .exec((err, problem) => {
    if (err) handler(false, 'Failed to load problem.', 503)(req, res);
    else if (!problem) handler(false, 'Problem does not exist.', 400)(req, res);
    else {
      Comment.populate(problem, {
        path: 'official_soln.comments alternate_soln.comments',
        select: 'author body created updated'
      }, (err, problem) => {
        if (err) {
          console.log(err);
          return handler(false, 'Failed to load solution comments.', 503)(req, res);
        } else {
          User.populate(problem, {
            path: 'official_soln.author official_soln.comments.author ' +
                  'alternate_soln.author alternate_soln.comments.author ' +
                  'comments.author',
            select: 'name'
          }, (err, problem) => {
            if (err) {
              console.log(err);
              handler(false, 'Failed to load solution author.', 503)(req, res);
            } else callback(problem);
          });
        }
      });
    }
  });
}

/*******************************************************************************
 * Generic routes.
 ******************************************************************************/

//@TODO check auths
router.get('/public', auth.verifyJWT, (req, res) => {
  Problem.find({ publicDatabase: true }, (err, problems) => {
    if (err) handler(false, 'Failed to load public database.', 503)(req, res);
    else handler(true, 'Successfully loaded public database.', 200, { problems })(req, res);
  });
});

router.post('/public', auth.verifyJWT, (req, res) => {
  const { problem_id, competition_id } = req.body;
  Competition.findById(competition_id, (err, competition) => {
    if (err) handler(false, 'Failed to load competition.', 503)(req, res);
    else if (!competition) handler(false, 'Competition does not exist.', 400)(req, res);
    else {
      Problem.findByIdAndUpdate(problem_id, { 
        publicDatabase: false, 
        borrowed: true, 
        competition: competition_id 
      }, (err, problem) => {
        console.log(err, problem);
        if (err) handler(false, 'Failed to load and update problem.', 503)(req, res);
        else if (!problem) handler(false, 'Problem does not exist.', 503)(req, res);
        else handler(true, 'Problem taken.', 200, { problem })(req, res);
      });
    }
  });
});

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
  problemParam(req.body.id, req, res, problem => {
    if (_.find(problem.upvotes, upvoteUserId => (upvoteUserId.equals(req.user._id)))){
      problem.upvotes.pull(req.user._id);
    } else {
      problem.upvotes.push(req.user._id);
    }
    problem.save(err => {
      if (err) handler(false, 'Failed to toggle upvote.', 503)(req, res);
      else handler(true, 'Toggled upvote.', 200, { problem })(req, res);
    });
  });
});

router.post('/comment/problem', auth.verifyJWT, (req, res) => {
  const { problem_id, body, issue } = req.body;
  problemParam(problem_id, req, res, problem => {
    const comment = Object.assign(new Comment(), {
      author: req.user,
      body,
      issue: !!issue
    });
    comment.save(err => {
      if (err) handler(false, 'Failed to save comment.', 503)(req, res);
      else {
        problem.comments.push(comment);
        problem.save(err => {
          if (err) handler(false, 'Failed to save comment to problem.', 503)(req, res);
          else handler(true, 'Successfully posted comment.', 200, { 
            comments: problem.comments
          })(req, res);
        });
      }
    });
  });
});

router.post('/comment/solution', auth.verifyJWT, (req, res) => {
  const { solution_id, body, issue } = req.body;
  Problem.findOne({ alternate_soln: solution_id }, (err, problem) => {
    problemParam(problem._id, req, res, problem => {
      let comment = Object.assign(new Comment(), {
        author: req.user,
        body,
        issue: !!issue
      });
      comment.save(err => {
        if (err) handler(false, 'Failed to save comment.', 503)(req, res);
        else {
          let soln = _.find(problem.alternate_soln, 
            soln => soln._id.toString() === solution_id
          );
          problem.alternate_soln.pull(solution_id);
          soln.comments.push(comment);
          problem.alternate_soln.push(soln);
          const alternate_soln = problem.alternate_soln;
          soln.save(err => {
            if (err) handler(false, 'Failed to save comment to problem.', 503)(req, res);
            else {
              Comment.populate(alternate_soln, 'comments', (err, alternate_soln) => {
                if (err) {
                  return handler(false, 'Failed to populate comments.', 503)(req, res);
                }
                User.populate(alternate_soln, {
                  path: 'comments.author',
                  select: 'name'
                }, (err, alternate_soln) => {
                  if (err) {
                    return handler(false, 'Failed to populate comment authors.', 503)(req, res);
                  }
                  handler(true, 'Successfully posted comment.', 200, { 
                    alternate_soln
                  })(req, res);
                });
              });
            }
          });
        }
      });
    });
  });
});

module.exports = router;
