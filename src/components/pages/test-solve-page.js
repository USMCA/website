import React from "react";
import { Row, Col } from "react-materialize";
import { LoadMore } from "../utilities";

const TestSolvePage = () => (
  <Row className="container">
    <Col m={7} s={12} style={{marginTop: "24px"}}>
      <p>Select a test from the <span className="bold-text">Contests</span> section on the right.</p>
    </Col>
    <Col m={5} s={12} style={{marginTop: "20px"}}>
      <h3>Requests</h3>
      <div className="notifications-container">
        <ul className="notifications-list">
          <li className="transparent">No test solve requests found.</li>
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
      <ul className="contests-list">
        <li>CMIMC 2018 (deadline: <span className="bold-text">January 20th, 2018</span>)
          <ul>
            <li><a className="underline-hover teal-text text-darken-3">test 1</a> (solved: 1/10)</li>
            <li><a className="underline-hover teal-text text-darken-3">test 2</a> (solved: 7/10)</li>
          </ul>
        </li>
        <li>PUMaC 2018 (deadline: <span className="bold-text">January 20th, 2018</span>)
          <ul>
            <li><a className="underline-hover teal-text text-darken-3">test 1</a> (solved: 2/10)</li>
            <li><a className="underline-hover teal-text text-darken-3">test 2</a> (solved: 4/10)</li>
          </ul>
        </li>
      </ul>
    </Col>
  </Row>
);

export default TestSolvePage;
