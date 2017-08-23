import React from "react";
import PropTypes from "prop-types";
import { Col } from "react-materialize";

const Error = ({ error, message, ...rest }) => {
  return error ? (
    <Col { ...rest } className="alert">
      <span className="form-error-msg">{ message }</span>
    </Col>
  ) : ( <div></div> );
};

Error.propTypes = {
  error: PropTypes.bool.isRequired,
  message: PropTypes.string
};

export default Error;
