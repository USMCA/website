import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import _ from "lodash";

import NotificationList from "./notification-list";
import RequestList from "./request-list";
import RequestCounter from "./request-counter";
import NotificationCounter from "./notification-counter";
import { VerticalNav, Counter } from "../../utilities";
import { requestEnum } from "../../../../constants";

const NotificationsTab = ({ unread, read, urgent, user }) => {
  const notificationsTabs = {
    "all": {
      title: "All",
      view: <NotificationList type="all" />
    },
    "urgent": {
      title: <div>Urgent <NotificationCounter type="urgent" /></div>,
      view: <NotificationList type="urgent" />
    },
    "unread": {
      title: <div>New <NotificationCounter type="unread" /></div>,
      view: <NotificationList type="unread" />
    },
    "requests": {
      title: <div>Requests <RequestCounter type={ requestEnum.REQUEST } /></div>,
      view: <RequestList type={ requestEnum.REQUEST } />
    },
    "invites": {
      title: <div>Invites <RequestCounter type={ requestEnum.INVITE } /></div>,
      view: <RequestList type={ requestEnum.INVITE } />
    }
  };

  return <VerticalNav tabs={ notificationsTabs } active="all" />;
};

export default NotificationsTab;
