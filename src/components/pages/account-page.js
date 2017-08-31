import React from "react";
import { Row } from "react-materialize";
import { Link } from "react-router-dom";
import _ from "lodash";

import NotificationsTab from "./account-page/notifications-tab";
import CompetitionsTab2 from "./account-page/competitions-tab-2";
import ProblemsTab from "./account-page/problems-tab";
import AccountTab from "./account-page/account-tab";
import { HorizontalNav } from "../utilities";
import auth from "../../auth";

const AccountPage = ({ match }) => {
  let accountTabs = {
    "notifications": {
      title: (
        <div>
          <Link to="/tabs/notifications">
            <i className="fa fa-bell" aria-hidden="true"></i> Notifications
          </Link>
        </div>
      ),
      view: <NotificationsTab />
    },
    "competitions": {
      title: (
        <div>
          <Link to="/tabs/competitions">
            <i className="fa fa-trophy" aria-hidden="true"></i> Competitions
          </Link>
        </div>
      ),
      view: <CompetitionsTab2 />
    },
    "problems": {
      title: (
        <div>
          <Link to="/tabs/problems">
            <i className="fa fa-pencil-square" aria-hidden="true"></i> Problems
          </Link>
        </div>
      ),
      view: <ProblemsTab />
    },
    "account": {
      title: (
        <div>
          <Link to="/tabs/account">
            <i className="fa fa-user" aria-hidden="true"></i> Account
          </Link>
        </div>
      ),
      view: <AccountTab />
    }
  };

  if (auth.isAdmin()) {
    accountTabs.admin = {
      title: (
        <div>
          <Link to="/tabs/account">
            <i className="fa fa-lock" aria-hidden="true"></i> Admin
          </Link>
        </div>
      ),
      view: <h1>Admin</h1>
    }
  }
 
  let active = match.params.tab || "notifications";
  if (!(_.find(_.keys(accountTabs), tab => tab === active))) {
    active = "notifications";
  }
  return (
  <Row className="container">
    <HorizontalNav tabs={ accountTabs } active={ active } />
  </Row>
  )
};

export default AccountPage;
