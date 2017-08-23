module.exports = function(connection) {
  const router = require('express').Router(),
        datetimeUtil = require('../utils/datetime'),
        auth = require('../config/auth')(connection);

  router.get('/problem/:prob_id', auth.verifyJWT, function(req, res, next) {
    var sql = 'SELECT * FROM comments WHERE ?';
    connection.query(sql, {prob_id: req.params.prob_id}, function(err, result) {
      if (err) {
        return res.status(503).json({
          message: 'Database failed to load comments.'
        });
      }

      res.status(200).json(result);
    });
  });

  router.post('/', auth.verifyJWT, function(req, res, next) {
    var sql = 'INSERT INTO comments SET ?';
    connection.query(sql, req.body, function(err, result) {
      if (err) {
        return res.status(503).json({
          message: 'Database failed to create comment.'
        });
      }

      res.status(200);
    });
  });

  return router;
}
