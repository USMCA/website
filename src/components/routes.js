import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Switch, Route, Redirect } from "react-router-dom";

import IndexPage from "./pages/index-page";
import LoginPage from "./pages/login-page";
import AccountPage from "./pages/account-page";
import ProposePage from "./pages/propose-page";
import TestSolvePage from "./pages/test-solve-page";
import ViewContestPage from "./pages/view-contest-page";
import ViewTestPage from "./pages/view-test-page";
import ViewDatabasePage from "./pages/view-database-page";
import ViewProblemPage from "./pages/view-problem-page";
import NotFoundPage from "./pages/not-found-page";
import requireAuth from "./auth/require-auth";

import { resetProposeForm } from "../actions";

const Routes = ({ authenticated, resetProposeForm }) => (
  <Switch>
    <Route exact path="/" component={ authenticated ? AccountPage : IndexPage } />
    <Route exact path="/login" component={ LoginPage }/>
    <Route 
      exact 
      path="/propose" 
      onEnter={ resetProposeForm }
      component={ requireAuth(ProposePage) }/>
    <Route exact path="/test-solve" component={ requireAuth(TestSolvePage) }/>
    <Route exact path="/view-contest" component={ requireAuth(ViewContestPage) }/>
    <Route exact path="/view-database" component={ requireAuth(ViewDatabasePage) }/>
    <Route exact path="/view-test" component={ requireAuth(ViewTestPage) }/>
    <Route 
      path="/view-problem/:id" 
      onEnter={ resetProposeForm }
      component={ requireAuth(ViewProblemPage) }/>
    <Route path="*" component={ NotFoundPage } />
  </Switch>
);

Routes.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  resetProposeForm: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
        authenticated: state.auth.authenticated
      }),
      mapDispatchToProps = dispatch => ({
        resetProposeForm: () => {
          resetProposeForm()(dispatch);
        }
      });

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Routes)
);
