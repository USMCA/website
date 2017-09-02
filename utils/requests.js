const async = require('async'),
      handler = require('./handler');

/* saves request and sends it to array of users */
const sendRequests = (users, request, req, res, callback) => {
  request.save(err => {
    if (err) {
      handler(false, 'Failed to save requests.', 503)(req, res);
    } else {
      const tasks = users.map(user => {
        return callback => {
          user.requests.push(request);
          user.save(err => {
            if (err) callback(err, null);
            else callback(null, null);
          });
        }
      });
      async.parallel(tasks, (err, results) => {
        if (err) {
          handler(false, 'Failed to send requests.', 503)(req, res);
        } else {
          callback();
        }
      });
    }
  });
};

/* remove request from array of users */
const removeRequests = (users, request, req, res, callback) => {
  const tasks = users.map(user => {
    return callback => {
      user.requests.pull(request);
      user.save(err => {
        if (err) callback(err, null);
        else callback(null, null);
      });
    }
  });
  async.parallel(tasks, (err, results) => {
    if (err) {
      handler(false, 'Database failed to remove requests.', 503)(req, res);
    } else {
      callback();
    }
  });
};

/* send notification to an array of users */
const sendNotifications = (users, notification, req, res, callback) => {
  const tasks = users.map(user => {
    return callback => {
      user.unread.push(notification);
      user.save(err => {
        if (err) callback(err, null);
        else callback(null, null);
      });
    }
  });
  async.parallel(tasks, (err, results) => {
    if (err) {
      handler(false, 'Failed to send notifications.', 503)(req, res);
    } else {
      callback();
    }
  });
}

/* removes the request from users, removes the request, saves the notification, 
 * and sends the notification to the request author. request.author must be 
 * populated. */
const replyRequest = (users, request, notification, req, res, callback) => {
  const requestAuthor = request.author; // must be populated
  removeRequests(users, request, req, res, () => {
    request.remove(err => {
      if (err) {
        handler(false, 'Failed to remove request.', 503)(req, res);
      } else {
        notification.save(err => {
          if (err) {
            console.log(err);
            handler(false, 'Failed to create notification to requester.', 503)(req, res);
          } else {
            sendNotifications([requestAuthor], notification, req, res, () => {
              handler(true, 'Competition rejected.', 200)(req, res);
            });
          }
        });
      }
    });
  });
};

module.exports = {
  sendRequests,
  removeRequests,
  replyRequest,
  sendNotifications
};
