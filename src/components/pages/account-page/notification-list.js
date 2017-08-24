import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Notification, LoadMore } from "../../utilities";
import { requestEnum } from "../../../../constants";

const NotificationList = ({ unread, read, urgent, type }) => {
  /* add styling */
  unread = unread.map(notif => Object.assign(notif, { label: "new" }));
  read = read.map(notif => Object.assign(notif, { label: "none" }));
  urgent = urgent.map(notif => Object.assign(notif, { label: "urgent" }));
  /* combine and sort unread, read, and urgent */ 
  let all = _.concat(unread, read, urgent);
  all = _.sortBy(all, "created");
  all = _(all).reverse().value();
  const notificationOptions = {
          unread, read, urgent, all 
        },
        notifications = notificationOptions[type];
  return (
    <div className="notifications-container">
      <ul className="notifications-list">
        {
          (notifications.length == 0) ? <li className="transparent">No notifications found.</li>
          : <div>
              {
                notifications.map((notification, key) => {
                  const { admin_author, title, body, competition } = notification;
                  let label;
                  switch (notification.label) {
                    case "new":
                      label = "new-announcement";
                      break;
                    case "urgent":
                      label = "urgent-announcement";
                      break;
                    default:
                      label = "";
                      break;
                  }
                  return (
                    <Notification 
                      className={label} 
                      author={admin_author ? 'Admin' : competition.short_name} 
                      title={title} 
                      message={body} 
                      key={key} />
                  );
                })
              }
              <li className="transparent center-align"><LoadMore /></li>
            </div>
        }
      </ul>
    </div>
  );
}

NotificationList.propTypes = {
  unread: PropTypes.array.isRequired,
  read: PropTypes.array.isRequired,
  urgent: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  unread: state.users.user.unread,
  read: state.users.user.read,
  urgent: state.users.user.urgent
});

export default connect(
  mapStateToProps
)(NotificationList);
