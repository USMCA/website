module.exports = function(connection) {
  const router = require('express').Router(),
        auth = require('../config/auth')(connection);
        datetimeUtil = require('../utils/datetime'),

  router.get('/problem/:prob_id', auth.verifyJWT, function(req, res, next) {
    var sql = 'SELECT * FROM alternate_solutions WHERE ?';
    connection.query(sql, {prob_id: req.params.prob_id}, function(err, result) {
      if (err) {
        return res.status(503).json({
          message: 'Database failed to load alternate solutions.'
        });
      }

      res.status(200).json(result);
    });
  });

  router.post('/', auth.verifyJWT, function(req, res, next) {
    var sql = 'INSERT INTO alternate_solutions SET ?';
    connection.query(sql, req.body, function(err, result) {
      if (err) {
        return res.status(503).json({
          message: 'Database failed to insert alternate solution.'
        });
      }

      res.status(200);
    });
  });

  return router;
};
