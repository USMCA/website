import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import _ from "lodash";

import { 
  VerticalNav, 
  Counter, 
  LoadMore, 
  Notification,
  Request
} from "../../utilities";
import { requestEnum } from "../../../../constants";
import { userInfo, userPut } from "../../../actions";

const { REQUEST, INVITE } = requestEnum;

class NotificationsTab extends React.Component {
  requestCounter = (userData, requestType) => { 
    if (!userData) return <div />;
    const data = userData.content;
    if (!data) return <div />;
    const { requests } = data;
    if (!requests) return <div></div>;
    const count = requests.filter(
            ({ type }) => type === requestType
          ).length;
    return <Counter count={ count } />;
  }

  requestList = ({ userData }, requestType) => {
    if (!userData) return <div />;
    const data = userData.content;
    if (!data) return <div />;
    let { requests } = data;
    if (!requests) return <div />;
    requests = _(
      _.sortBy(
        requests.filter(
          ({ type }) => type === requestType
        ), "created"
      )
    ).reverse().value();
    let noRequestView = <li className="transparent">Error.</li>;
    switch (requestType) {
      case REQUEST:
        noRequestView = <li className="transparent">No requests found.</li>;
        break;
      case INVITE:
        noRequestView = <li className="transparent">No invites found.</li>;
        break;
    }
    return (
      <div className="notifications-container">
        <ul className="notifications-list">
          {
            (requests.length === 0) ? noRequestView : 
            <div>
              {
                requests.map((request, key) => <Request request={request} key={key} />)
              }
              <li className="transparent center-align"><LoadMore /></li>
            </div>
        }
        </ul>
      </div>
    );
  }

  notificationCounter = (userData, type) => {
    if (!userData) return <div />;
    const data = userData.content;
    if (!data) return <div />;
    let notifications = data[type];
    if (!notifications) {
      if (type === "all") {
        const { unread, read, urgent } = data;
        notifications = _.concat(unread, read, urgent);
      } else return <div />;
    }
    return <Counter count={ notifications.length } />;
  }
    
  notificationList = ({ userData, markRead, markUrgent, markUnread }, type) => {
    if (!userData) return <div />;
    const data = userData.content;
    if (!data) return <div />;
    let { unread, read, urgent } = data;
    if (!unread || !read || !urgent) return <div />;
    /* add styling and handleClick */
    const styleNotifs = (notifs, label, handleClick) => {
      return notifs.map(notif => Object.assign(notif, { label, handleClick }));
    };
    unread = styleNotifs(unread, "new-announcement", markRead);
    read = styleNotifs(read, "", markUrgent);
    urgent = styleNotifs(urgent, "urgent-announcement", markUnread);
    /* combine and sort unread, read, and urgent */ 
    const all = _.concat(unread, read, urgent),
          notificationOptions = { unread, read, urgent, all };
    let notifications= _.sortBy(notificationOptions[type], "created");
    notifications = _(notifications).reverse().value();
    return (
      <div className="notifications-container">
        <ul className="notifications-list">
          {
            (notifications.length == 0) ? 
            <li className="transparent">No notifications found.</li> : 
            <div>
              {
                notifications.map((notification, key) => {
                  const { 
                    admin_author, 
                    title, 
                    body, 
                    author, 
                    label, 
                    handleClick,
                    _id
                  } = notification;
                  return (
                    <Notification 
                      className={label} 
                      author={admin_author ? 'Admin' : author ? (author.short_name || 'N/A') : 'N/A' } 
                      title={title} 
                      message={body} 
                      key={key}
                      onClick={ () => handleClick(notification._id) } />
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

  notificationsTabs = () => { 
    return ({
      "all": {
        title: () => "All",
        view: (props) => this.notificationList(props, "all")
      },
      "urgent": {
        title: ({ userData }) => (
          <div>Urgent { this.notificationCounter(userData, "urgent") }</div>
        ),
        view: (props) => this.notificationList(props, "urgent")
      },
      "unread": {
        title: ({ userData }) => (
          <div>New { this.notificationCounter(userData, "unread") }</div>
        ),
        view: (props) => this.notificationList(props, "unread")
      },
      "requests": {
        title: ({ userData }) => (
          <div>Requests { this.requestCounter(userData, REQUEST) }</div>
        ),
        view: (props) => this.requestList(props, REQUEST)
      },
      "invites": {
        title: ({ userData }) => (
          <div>Invites { this.requestCounter(userData, INVITE) }</div>
        ),
        view: (props) => this.requestList(props, INVITE)
      }
    });
  }

  render() {
    this.notificationsTabsViews = this.notificationsTabs();
    if (!this.notificationsTabsViews) return <div />;

    const { userData, markRead, markUnread, markUrgent } = this.props;
    const childProps = {
            "all": { userData, markRead, markUnread, markUrgent },
            "urgent": { userData, markUnread },
            "unread": { userData, markRead },
            "requests": { userData },
            "invites": { userData }
          },
          headerProps = {
            "urgent": { userData },
            "unread": { userData },
            "requests": { userData },
            "invites": { userData }
          };

    return (
      <div style={{marginTop: "36px"}}>
        <VerticalNav 
          tabs={ this.notificationsTabsViews } 
          active="all"
          childProps={ childProps }
          headerProps={ headerProps } />
      </div>
    );
  }
};

const mapStateToProps = state => ({
        userData: state.users.user
      }),
      mapDispatchToProps = dispatch => ({
        userInfo: () => { userInfo()(dispatch); },
        markRead: notif => { 
          userPut({ 
            $pull: { unread: notif, urgent: notif }, 
            $push: { read: notif } 
          })(dispatch);
        },
        markUnread: notif => { 
          userPut({ 
            $pull: { urgent: notif, read: notif }, 
            $push: { unread: notif } 
          })(dispatch);
        },
        markUrgent: notif => {
          userPut({ 
            $pull: { read: notif, unread: notif }, 
            $push: { urgent: notif } 
          })(dispatch);
        }
      });

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsTab);
