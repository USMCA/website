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
    .populate('official_soln', 'author.name body') 
    .populate('alternate_soln', 'author.name body') 
    .populate('comments', 'author.name body') 
    .exec((err, problem) => {
      if (err) {
        console.log(err);
        return handler(false, 'Database failed to load problem.', 503)(req, res);
      } else if (!problem) {
        return handler(false, 'Problem was not found.', 400)(req, res);
      } else {
        return handler(true, 'Successfully loaded problem.', 200, {
          problem: problem
        })(req, res);
      }
    });
  } else {
    return handler(false, 'Invalid problems endpoint.', 400)(req, res);
  }
});

module.exports = router;
