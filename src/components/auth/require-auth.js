import React, { Component } from "react";
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
    authenticated: PropTypes.object.isRequired
  };

  const mapStateToProps = state => ({
    authenticated: state.auth.authenticated.content
  });
  
  return connect(mapStateToProps)(AuthenticatedComponent);
}
