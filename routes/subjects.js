module.exports = function(connection) {
  const router = require('express').Router();

  router.get('/', function(req, res, next) {
    var sql = 'SELECT * FROM subjects';
    connection.query(sql, function(err, result) {
      if (err) {
        return res.status(503).json({
          error: true,
          message: 'Database failed to load subjects.'
        });
      }
      return res.status(200).json({
        error: false,
        content: result
      });
    });
  });

  return router;
};
