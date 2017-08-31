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
import { userInfo } from "../../../actions";

const { REQUEST, INVITE } = requestEnum;

class NotificationsTab extends React.Component {
  componentWillMount() {
    this.props.userInfo();
  }

  requestCounter = (content, requestType) => {
    if (!content.requests) return "";
    const count = content.requests.filter(
            ({ type }) => type === requestType
          ).length;
    return <Counter count={ count } />;
  }

  requestList = (content, requestType) => {
    if (!content.requests) return "";
    const requests = content.requests.filter(
      ({ type }) => type === requestType
    );
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
            (requests.length == 0) ? noRequestView : 
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

  notificationCounter = (content, type) => {
    let { unread, read, urgent } = content;
    if (!unread || !read || !urgent ) return <div></div>;
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
  }
    
  notificationList = (content, type) => {
    let { unread, read, urgent } = content;
    if (!unread || !read || !urgent) return <div></div>;
    /* add styling */
    unread = unread.map(notif => Object.assign(notif, { label: "new-announcement" }));
    read = read.map(notif => Object.assign(notif, { label: "" }));
    urgent = urgent.map(notif => Object.assign(notif, { label: "urgent-announcement" }));
    /* combine and sort unread, read, and urgent */ 
    let all = _.concat(unread, read, urgent);
    all = _.sortBy(all, "created");
    all = _(all).reverse().value();
    const notificationOptions = { unread, read, urgent, all },
          notifications = notificationOptions[type];
    return (
      <div className="notifications-container">
        <ul className="notifications-list">
          {
            (notifications.length == 0) ? <li className="transparent">No notifications found.</li>
            : <div>
                {
                  notifications.map((notification, key) => {
                    const { admin_author, title, body, competition, label } = notification;
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

  notificationsTabs = ({ content }) => { 
    if (!content) return null; 
    const { unread, read, urgent, requests } = content;
    if (!unread || !read || !urgent || !requests) return null;
    return ({
      "all": {
        title: "All",
        view: this.notificationList(content, "all")
      },
      "urgent": {
        title: <div>Urgent { this.notificationCounter(content, "urgent") }</div>,
        view: this.notificationList(content, "urgent")
      },
      "unread": {
        title: <div>New { this.notificationCounter(content, "unread") }</div>,
        view: this.notificationList(content, "unread")
      },
      "requests": {
        title: <div>Requests { this.requestCounter(content, REQUEST) }</div>,
        view: this.requestList(content, REQUEST)
      },
      "invites": {
        title: <div>Invites { this.requestCounter(content, INVITE) }</div>,
        view: this.requestList(content, INVITE)
      }
    });
  }

  render() {
    const { userData } = this.props;
    this.notificationsTabsViews = this.notificationsTabs(userData);
    if (!this.notificationsTabsViews) return <div></div>;
    return (
      <div style={{marginTop: "36px"}}>
        <VerticalNav tabs={ this.notificationsTabsViews } active="all" />
      </div>
    );
  }
};

NotificationsTab.propTypes = {
  userData: PropTypes.object.isRequired,
  userInfo: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
        userData: state.users.user
      }),
      mapDispatchToProps = dispatch => ({
        userInfo: () => { userInfo()(dispatch); }
      });

export default connect(
  mapStateToProps, mapDispatchToProps
)(NotificationsTab);
