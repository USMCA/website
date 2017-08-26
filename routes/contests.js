const router = require('express').Router(),
      _ = require('lodash'),
      async = require('async'),
      auth = require('../config/auth'),
      handler = require('../utils/handler'),
      { requestTypes, requestEnum } = require('../constants');
const { REQUEST, ACCEPT, REJECT } = requestTypes;

const User = require('../database/user'),
      Competition = require('../database/competition'),
      Contest = require('../database/contest');

router.post('/', auth.verifyJWT, (req, res) => {
  const { competition_id, name, date, locations } = req.body;
  Competition.findById(competition_id, '_id directors', (err, competition) => {
    if (err) {
      handler(false, 'Database failed to find the associated competition.', 503)(req, res);
    } else if (!competition) {
      handler(false, 'The associated competition does not exist.', 503)(req, res);
    } else {
      const user = _.find(competition.directors, director_id => {
        return director_id.equals(req.user._id);
      });
      if (!user) {
        return handler(false, 'User is not a director of the competition.', 401)(req, res);
      } else {
        const contest = Object.assign(new Contest(), {
          competition: competition._id,
          name: name,
          date: new Date(date),
          locations: locations
        });
        contest.save(err => {
          if (err) {
            return handler(false, 'Database failed to save the contest.', 503)(req, res);
          } else {
            return handler(true, 'Successfully created the contest.', 200)(req, res);
          }
        });
      }
    }
  });
});

module.exports = router;
