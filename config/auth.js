/*******************************************************************************
 *
 * Configure JWT authentication logic.
 *
 ******************************************************************************/

const jwt = require('jsonwebtoken'),
      crypto = require('crypto'),
      handler = require('../utils/handler');

const User = require('../database/user');

module.exports = {
  /***************************************************************************
   * verifyJWT: middleware for verifying the token
   **************************************************************************/
  verifyJWT: (req, res, next) => {
    if (!req.headers.authorization) {
      handler(false, 'No authorization provided.', 403)(req, res);
    }
    let token = req.headers.authorization.substr('Bearer '.length);
    token = token || req.body.token || req.query.token;
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          handler(false, 'Failed to authenticate token.', 503)(req, res);
        } else {
          User.findById(decoded.user_id, (err, user) => {
            if (err) {
              handler(false, 'Database failed to find user.', 503)(req, res);
            } else {
              req.payload = decoded;
              req.user = user;
              next();
            }
          });
        }
      });
    } else {
      handler(false, 'No token provided.', 403)(req, res);
    }
  }, 

  /***************************************************************************
   * signJWT: helper function for creating the token
   **************************************************************************/
  signJWT: (email, user_id, admin) => {
    // set expiration to 60 days
    let today = new Date(),
        exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
      email: email,
      user_id: user_id,
      admin: admin,
      exp: parseInt(exp.getTime() / 1000),
    }, process.env.JWT_SECRET);
  }, 

  /***************************************************************************
   * authenticate: authenticate user with email and password
   **************************************************************************/
  authenticate: (email, password, callback) => {
    User.findOne({ email: email }, (err, user) => {
      if (err) {
        return callback({
          success: false,
          message: 'Database failed to load email.'
        });
      } else if (!user) {
        return callback({
          success: false,
          message: 'Email not found.'
        });
      } else {
        return user.correctPassword(password) ? 
          callback({ success: true, user: user }) : 
          callback({ success: false, message: 'Incorrect password' });
      }
    });
  }
};
