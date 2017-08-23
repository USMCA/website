import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Counter } from "../../utilities";

const NotificationCounter = ({ unread, read, urgent, type }) => {
  /* add styling */
  unread = unread.map(notif => Object.assign(notif, { label: "new" }));
  read = read.map(notif => Object.assign(notif, { label: "none" }));
  urgent = urgent.map(notif => Object.assign(notif, { label: "urgent" }));
  /* combine and sort unread, read, and urgent */ 
  let all = _.concat(unread, read, urgent);
  all = _.sortBy(all, "created");
  const notificationOptions = {
          unread, read, urgent, all 
        },
        count = notificationOptions[type].length;
  return <Counter count={ count } />
};

NotificationCounter.propTypes = {
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
)(NotificationCounter);
