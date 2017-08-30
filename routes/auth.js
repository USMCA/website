const router = require('express').Router(),
      auth = require('../config/auth'),
      handler = require('../utils/handler');

const User = require('../database/user');

router.post('/signup', (req, res) => {
  const { name, email, password, university } = req.body;
  if (!name || !email || !password || !university) {
    handler(false, 'Please fill out all fields.', 400)(req, res);
  } else { 
    User.findOne({ email }, (err, user) => {
      if (err) {
        handler(false, 'Database failed to find email.', 503)(req, res);
      } else if (user) {
        handler(false, 'Email exists already.', 400)(req, res);
      } else {
        const user = Object.assign(new User(), {
                name, email, password, university
              }),
              admin = false;
        user.save(err => {
          if (err) {
            handler(false, 'Database failed to save user.', 503)(req, res);
          } else {
            handler(true, 'User signed up successfully.', 200, {
              token: auth.signJWT(email, user._id, admin)
            })(req, res);
          }
        });
      }
    });
  }
});

router.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    handler(false, 'Please fill out all fields.', 400)(req, res);
  } else {
    User.findOne({ email }, (err, user) => {
      if (err) {
        handler(false, 'Database failed to find email.', 503)(req, res);
      } else if (!user) {
        handler(false, 'Account does not exist.', 400)(req, res);
      } else {
        user.checkPassword(password, (err, result) => {
          if (err) {
            handler(false, 'Database failed to authenticate.', 503)(req, res);
          } else {
            return result.authenticated ? 
              handler(true, 'User authenticated.', 200, {
                token: auth.signJWT(user.email, user._id, user.admin)
              })(req, res) :
              handler(false, 'Authentication failed.', 401)(req, res);
          }
        });
      }
    });
  }
});

router.post('/password', auth.verifyJWT, (req, res) => {
  const { currPass, newPass } = req.body;
  console.log(currPass, newPass);
  req.user.checkPassword(currPass, (err, result) => {
    if (err) {
      handler(false, 'Database failed to authenticate.', 503)(req, res);
    } else if (result.authenticated) {
      req.user.password = newPass;
      req.user.save(err => {
        if (err) 
          handler(false, 'Database failed to save new password.', 503)(req, res);
        else {
          handler(true, 'Successfully updated password.', 200, {
            token: auth.signJWT(req.user.email, req.user._id, req.user.admin)
          })(req, res);
        }
      }); 
    } else {
      handler(false, 'Failed to authenticate user.', 401)(req, res);
    }
  });
});

module.exports = router;
