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
  Competition.findById(competition_id, (err, competition) => {
    if (err) {
      handler(false, 'Database failed to find the associated competition.', 503)(req, res);
    } else if (!competition) {
      handler(false, 'The associated competition does not exist.', 503)(req, res);
    } else {
      if (competition.directors.indexOf(req.user._id) === -1) {
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
            console.log(err);
            return handler(false, 'Database failed to save the contest.', 503)(req, res);
          } else {
            competition.contests.push(contest._id);
            competition.save(err => {
              if (err) {
                console.log(err);
                handler(false, 'Database failed to save contest to competition.', 503)(req, res);
              } else {
                handler(true, 'Successfully created the contest.', 200)(req, res);
              }
            });
          }
        });
      }
    }
  });
});

module.exports = router;
