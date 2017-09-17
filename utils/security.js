const Competition = require('../database/competition'),
      handler = require('./handler');

module.exports = {
  /* checking secure membership, assumes authenticated */
  isSecure: (req, res, callback) => {
    if (!req.user) handler(false, 'User not authenticated.', 400)(req, res);
    else if (req.user.admin) callback(true);
    else {
      Competition.find({
        $or: [
          { secure_members: req.user._id },
          { czars: req.user._id },
          { directors: req.user._id }
        ]
      }, (err, competitions) => {
        if (err) handler(false, 'Failed to load secure member competitions.', 503)(req, res);
        else if (competitions.length === 0) callback(false);
        else callback(true);
      });
    }
  }
};
