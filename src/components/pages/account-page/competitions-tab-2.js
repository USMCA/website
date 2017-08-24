import React from "react";
import {  } from "react-materialize";
import { RightButtonPanel, VerticalNav } from "../../utilities";

const tabs = {
  "info": {
    title: "Information",
    view: <div className="round-container">
      <ul>
        <li><h3>Competition Info [edit]</h3></li>
        <li>Name: Carnegie Mellon Informatics and Mathematics Competition</li>
        <li>Short name: CMIMC</li>
        <li>Website: cmimc.org</li>
        <li><h3>Membership Info</h3></li>
        <li>Your are a: <span className="bold-text">(member/secure member/director)</span></li>
        <li>Step down as director</li>
        <li>Leave competition</li>
        <li><h3>Database</h3></li>
        <li>View database</li>
      </ul>
    </div>
  },
  "members": {
    title: "Members",
    view: <div className="round-container">
      <ul>
        <li>Add new member</li>
        <li><h3>Roster</h3></li>
        <li>Cody Johnson / ctj@math.cmu.edu / member / Promote to / Reduce permissions to / Remove</li>
      </ul>
    </div>
  },
  "contests": {
    title: "Contests",
    view: <div className="round-container">
      <ul>
        <li>Create contest</li>
        <li><h3>CMIMC 2018 [edit] [delete]</h3></li>
        <li>View contest</li>
        <li>Date: January 28th, 2018</li>
        <li>Test solve deadline: January 14th, 2018</li>
        <li>Location(s): Carnegie Mellon University (5000 Forbes Ave, Pittsburgh, PA), CMU Qatar Campus (14 Jihad St, Al Qaeda, Qatar)</li>
        <li>Status: <span className="bold-text">active</span> (mark as inactive)</li>
      </ul>
    </div>
  }
}

const CompetitionsTab2 = () => (
  <div>
    [Join a competition] [Create new competition]
    <div style={{borderBottom: "1px solid #cfd8dc"}}>
      <h2 className="teal-text text-darken-3">CMIMC</h2>
      <VerticalNav tabs={ tabs } active="info" />
    </div>
  </div>
);

export default CompetitionsTab2;
