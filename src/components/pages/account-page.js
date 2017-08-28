import React from "react";
import { Row } from "react-materialize";

import NotificationsTab from "./account-page/notifications-tab";
import CompetitionsTab2 from "./account-page/competitions-tab-2";
import ProblemsTab from "./account-page/problems-tab";
import AccountTab from "./account-page/account-tab";
import { HorizontalNav } from "../utilities";

const AccountPage = () => {
  const accountTabs = {
    "notifications": {
      title: <div><i className="fa fa-bell" aria-hidden="true"></i> Notifications</div>,
      view: <NotificationsTab />
    },
    "competitions": {
      title: <div><i className="fa fa-trophy" aria-hidden="true"></i> Competitions</div>,
      view: <CompetitionsTab2 />
    },
    "problems": {
      title: <div><i className="fa fa-pencil-square" aria-hidden="true"></i> Problems</div>,
      view: <ProblemsTab />
    },
    "account": {
      title: <div><i className="fa fa-user" aria-hidden="true"></i> Account</div>,
      view: <AccountTab />
    }
  };

  return (
  <Row className="container">
    <HorizontalNav tabs={ accountTabs } active="notifications" />
  </Row>
  )
};

export default AccountPage;
