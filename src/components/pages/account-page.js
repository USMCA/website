import React from "react";
import { Row } from "react-materialize";

import NotificationsTab from "./account-page/notifications-tab";
import CompetitionsTab from "./account-page/competitions-tab";
import ProblemsTab from "./account-page/problems-tab";
import AccountTab from "./account-page/account-tab";
import { HorizontalNav } from "../utilities";

const proposals = [
  {probid: 123, votes: 0, solves: 1, views: 2, subject: "Algebra", contest: "CMIMC 2017", statement: "hi, but $\\int_0^t x~dx$"},
  {probid: 123, votes: 1, solves: 15, views: 20, subject: "Calculus", contest: "CMIMC 2017", statement: "hi"}
];

const AccountPage = () => {
  const accountTabs = {
    "notifications": {
      title: <div><i className="fa fa-bell" aria-hidden="true"></i> Notifications</div>,
      view: <NotificationsTab />
    },
    "competitions": {
      title: <div><i className="fa fa-trophy" aria-hidden="true"></i> Competitions</div>,
      view: <CompetitionsTab />
    },
    "problems": {
      title: <div><i className="fa fa-pencil-square" aria-hidden="true"></i> Problems</div>,
      view: <ProblemsTab proposals={ proposals } />
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
