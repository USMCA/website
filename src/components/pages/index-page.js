import React, { Component } from "react";
import PropTypes from "prop-types";
import { Row, Col, Card } from "react-materialize";

import SignupForm from "../forms/signup";

const IndexPage = () => (
  <Row className="container">
    <Col m={5} s={12} style={{marginTop: "24px"}}>
      <h1 className="teal-text text-darken-4">USMCA</h1>
      <p>Welcome to the official USMCA problem proposals website. If you have not already, sign up and add some contests to your profile.</p>
    </Col>
    <Col m={5} s={12} offset="m1" style={{marginTop: "24px"}}>
      <Card>
        <h2 className="teal-text text-darken-4">Sign Up</h2>
        <SignupForm />
      </Card>
    </Col>
  </Row>
);

export default IndexPage;
