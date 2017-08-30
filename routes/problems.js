const router = require('express').Router(),
      _ = require('lodash'),
      async = require('async'),
      auth = require('../config/auth'),
      handler = require('../utils/handler'),
      { requestTypes, requestEnum } = require('../constants');
const { REQUEST, ACCEPT, REJECT } = requestTypes;

const User = require('../database/user'),
      Problem = require('../database/problem');

router.get('/', auth.verifyJWT, (req, res) => {
  if (req.query.id) {
    Problem.findById(req.query.id)
    .populate('author', 'name _id')
    .populate('competition', 'short_name _id')
    .populate('official_soln', 'author body')
    .populate('alternate_soln', 'author body')
    .populate('comments', 'author body')
    .exec((err, problem) => {
      if (err) {
        console.log(err);
        return handler(false, 'Database failed to load problem.', 503)(req, res);
      } else if (!problem) {
        return handler(false, 'Problem was not found.', 400)(req, res);
      } else {
        User.populate(problem, {
          path: 'official_soln.author alternate_soln.author comments.author',
          select: 'name'
        }, (err, problem) => {
          if (err) {
            console.log(err);
            return handler(false, 'Database failed to load solution author.', 503)(req, res);
          } else {
            console.log(problem);
            return handler(true, 'Successfully loaded problem.', 200, { problem })(req, res);
          }
        });
      }
    });
  } else {
    return handler(false, 'Invalid problems endpoint.', 400)(req, res);
  }
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

module.exports = router;
