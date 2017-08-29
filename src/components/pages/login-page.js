import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Row, Col, Input, Button, Card } from "react-materialize";

import LoginForm from "../forms/login";

const LoginPage = () => (
  <Row className="container">
    <Col l={6} s={12} offset={"l3"} style={{marginTop: "24px"}}>
      <Card>
        <h2 className="teal-text text-darken-4">Log In</h2>
        <LoginForm />
      </Card>
    </Col>
  </Row>
);

export default LoginPage;
