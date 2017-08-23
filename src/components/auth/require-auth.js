import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import ForbiddenPage from "../pages/forbidden-page";

export default function(ClassifiedComponent) {
  const AuthenticatedComponent = props => (
    props.authenticated ? (
      <ClassifiedComponent { ...props } />
    ) : (
      <ForbiddenPage />
    )
  );

  AuthenticatedComponent.propTypes = {
    authenticated: PropTypes.bool.isRequired
  };

  const mapStateToProps = state => ({
    authenticated: state.auth.authenticated
  });
  
  return connect(mapStateToProps)(AuthenticatedComponent);
}
