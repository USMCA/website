import React from "react";
import { Row, Col } from "react-materialize";
import { LoadMore } from "../utilities";

const TestSolvePage = () => (
  <Row className="container">
    <Col m={7} s={12}>
      <h2 className="teal-text text-darken-4">CMIMC 2018 Geo</h2>
    </Col>
    <Col m={5} s={12} style={{marginTop: "48px"}}>
      <div className="notifications-container">
        <ul className="notifications-list">
          <li className="transparent">No notifications found.</li>
          <li className="new-announcement">
            <a href="#"><span className="select-circle"></span></a>
            <span className="bold-text">CMIMC</span> requests <span className="bold-text">5</span> test solvers. Their deadline is <span className="bold-text">January 20th, 2018</span>. <a href className="underline-hover">Apply</a>
          </li>
          <li>
            <a href="#"><span className="select-circle"></span></a>
            <span className="bold-text">PUMaC</span> requests <span className="bold-text">8</span> test solvers. Their deadline is <span className="bold-text">January 20th, 2018</span>. <a href className="underline-hover">Apply</a>
          </li>
          <li>
            <a href="#"><span className="select-circle"></span></a>
            <span className="bold-text">HMMT</span> requests <span className="bold-text">20</span> test solvers. Their deadline is <span className="bold-text">January 20th, 2018</span>. <a href className="underline-hover">Apply</a>
          </li>
          <li className="transparent center-align"><LoadMore /></li>
        </ul>
      </div>
      <h3>Contests</h3>
    </Col>
  </Row>
);

export default TestSolvePage;
