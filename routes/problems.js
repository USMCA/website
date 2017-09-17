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
      Test = require('../database/test'),
      Competition = require('../database/competition'),
      Contest = require('../database/contest');

/* getting a problem for displaying */
const problemParam = (problem_id, req, res, callback)  => {
  Problem.findById(problem_id)
  .populate('author', 'name _id')
  .populate('competition', 'short_name _id directors czars secure_members')
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
/* load public database */
router.get('/public', auth.verifyJWT, (req, res) => {
  Problem.find({ publicDatabase: true }, (err, problems) => {
    if (err) handler(false, 'Failed to load public database.', 503)(req, res);
    else handler(true, 'Successfully loaded public database.', 200, { problems })(req, res);
  });
});

/* take a problem from public database to a competition */
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
        else handler(true, 'Problem successfully taken.', 200, { problem })(req, res);
      });
    }
  });
});

/* restrict access to problem */
router.param('problem_id', (req, res, next, problem_id) => {
  auth.verifyJWT(req, res, () => {
    problemParam(problem_id, req, res, problem => {
      if (!req.user._id.equals(problem.author._id) && // author
          problem.competition &&
          problem.competition.directors.indexOf(req.user._id.toString()) === -1 && // competition director
          problem.competition.czars.indexOf(req.user._id.toString()) === -1 && // competition czar
          problem.competition.secure_members.indexOf(req.user._id.toString()) === -1 // competition secure member
         ) {
        Contest.findOne({
          competition: problem.competition._id,
          test_solvers: req.user._id
        }, (err, contest) => {
          if (err) handler(false, 'Failed to load test solvers data.', 503)(req, res);
          else if (!contest) handler(false, 'Unauthorized access to problem.', 401)(req, res);
          else {
            req.problem = problem;
            next();
          }
        });
      }
      else {
        req.problem = problem;
        next();
      }
    });
  });
});

router.get('/:problem_id', auth.verifyJWT, (req, res) => {
  problemParam(req.params.problem_id, req, res, problem => {
    handler(true, 'Successfully loaded problem.', 200, { problem })(req, res);
  });
});

router.put('/:problem_id', auth.verifyJWT, (req, res) => {
  const { problem_id } = req.params,
        proposal = _.pick(req.body, ['statement', 'answer']);
  Problem.findByIdAndUpdate(problem_id, proposal, (err, problem) => {
    if (err) handler(false, 'Failed to load and update problem.', 503)(req, res);
    else if (!problem) handler(false, 'Problem does not exist.', 400)(req, res);
    else {
      problemParam(problem._id, req, res, problem => {
        handler(true, 'Problem updated.', 200, { problem })(req, res);
      });
    }
  });
});

router.delete('/:problem_id', auth.verifyJWT, (req, res) => {
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

router.post('/publicize', auth.verifyJWT, (req, res) => {
  const { problem_id } = req.body;
  Problem.findById(problem_id, (err, problem) => {
    if (err) handler(false, 'Failed to load problem.', 503)(req, res);
    else if (!problem) handler(false, 'Problem does not exist.', 400)(req, res);
    else {
      if (!problem.author.equals(req.user._id))
        handler(false, 'User is not the author.', 401)(req, res);
      else {
        Test.findOne({ problems: problem }, (err, test) => {
          if (err) handler(false, 'Failed to check for tests that use the problem.', 503)(req, res);
          else if (test) 
            handler(false, `The problem is in use by the test ${test.name}.`, 400)(req, res);
          else {
            problem.publicDatabase = true;
            problem.competition = null;
            problem.save(err => {
              if (err) handler(false, 'Failed to publicize problem.', 503)(req, res);
              else handler(true, 'Successfully publicized problem.', 200, { problem_id: problem._id })(req, res);
            });
          }
        });
      } 
    }
  });
});

module.exports = router;
