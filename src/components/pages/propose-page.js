import * as React from "react";
import { Row, Col, Input, Button } from "react-materialize";

import ProposeForm from "../forms/propose";

class ProposePage extends React.Component {
  render() {
    return (
      <Row className="container">
        <h2 className="teal-text text-darken-4">Propose a Problem</h2>
        <ProposeForm />
      </Row>
    );
  }
}

export default ProposePage;
