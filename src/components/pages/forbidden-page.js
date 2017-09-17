import React, { Component } from "react";
import { Row, Col } from "react-materialize";
import { Link } from "react-router-dom";

const ForbiddenPage = () => (
  <Row className="container">
    <Col>
      <h1>401 Forbidden</h1>
      <p>Sorry, the page you requested is unauthorized! Please <Link to="/">sign up</Link> or <Link to="/login">log in</Link> to access this page.</p>
    </Col>
  </Row>
)

export default ForbiddenPage;
