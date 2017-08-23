module.exports = function(connection) {
  const auth = require('../config/auth')(connection),
        mysql = require('mysql'),
        router = require('express').Router();

  router.get('/', auth.verifyJWT, function(req, res, next) {
    var sql = 'SELECT staff_id, name, email, privilege FROM staff';
    connection.query(sql, function(err, result) {
      if (err) { 
        return res.status(503).json({
          message: 'Database failed to load staff list.'
        });
      }

      res.status(200).json(result);
    });
  });

  router.param('staff_id', function(req, res, next, staff_id) {
    var sql = 'SELECT * FROM staff WHERE ?';
    connection.query(sql, {staff_id: staff_id}, function(err, result) {
      if(err) {
        return res.status(503).json({
          message: 'Database failed to load staff data.'
        });
      }
      if (!result) return res.status(400).json({message: 'Staff not found.'});
      else req.staff = result[0];

      return next();
    });
  });

  router.get('/:staff_id', function(req, res, next) {
    res.status(200).json({name: req.staff.name}); 
  });

  router.put('/privilege/:staff_id', auth.verifyJWT, function(req, res, next) {
    // must be admin
    if (req.payload.privilege !== 'admin') { 
      return res.status(401).json({
        message: 'Must be admin to change privileges.'
      });
    }
    // cannot change own status (so that there will always be at least one admin)
    if (req.payload.staff_id === req.staff.staff_id) {
      return res.status(401).json({
        message: 'One cannot change their own status.'
      });
    }

    var sql = 'UPDATE staff SET ? WHERE staff_id=' + 
      mysql.escape(req.staff.staff_id);
    connection.query(sql, {privilege: req.body.privilege}, function(err, result) {
      if (err) {
        return res.status(503).json({
          message: 'Database failed to update staff privilege.'
        });
      }
      if (!result) {
        return res.status(400).json({message: 'Staff not found.'});
      }

      res.status(200);
    });
  });

  router.delete('/:staff_id', auth.verifyJWT, function(req, res, next) {
    // must be admin
    if (req.payload.privilege !== 'admin') { 
      return res.status(401).json({message: 'Must be admin to delete staff.'});
    }
    var sql = "DELETE FROM staff WHERE ?";
    connection.query(sql, {staff_id: req.staff.staff_id}, function(err, result) {
      if (err) {
        return res.status(503).json({
          message: 'Database failed to delete staff.'
        });
      }
      res.status(200);
    });
  });

  return router;

};
