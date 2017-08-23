import React from "react";
import PropTypes from "prop-types";
import { Col } from "react-materialize";

import { ProblemPreview, LoadMore } from "../../utilities";

const ProblemsTab = ({ proposals }) => (
  <Col s={12}>
    {
      proposals.map((proposal, key) => (
        <ProblemPreview problem={proposal} key={key} />
      ))
    }
    <LoadMore />
  </Col>
);

export default ProblemsTab;
