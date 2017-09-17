import * as React from "react";
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
import PublicDatabasePage from "./pages/public-database-page";
import NotFoundPage from "./pages/not-found-page";
import requireAuth from "./auth/require-auth";

import * as Pages from "./pages";

const Routes = ({ authenticated }) => (
  <Switch>
    <Route exact path="/" component={ authenticated ? AccountPage : IndexPage } />
    <Route path="/home/:tab" component={ authenticated ? AccountPage : IndexPage } />
    <Route exact path="/login" component={ LoginPage }/>
    <Route exact path="/propose" component={ requireAuth(ProposePage) }/>
    <Route exact path="/test-solve" component={ requireAuth(TestSolvePage) }/>
    <Route exact path="/public-database" component={ requireAuth(PublicDatabasePage) }/>
    <Route path="/view-contest/:id" component={ requireAuth(ViewContestPage) }/>
    <Route path="/view-database/:id" component={ requireAuth(ViewDatabasePage) }/>
    <Route path="/view-test/:id" component={ requireAuth(ViewTestPage) }/>
    <Route path="/view-problem/:id" component={ requireAuth(ViewProblemPage) }/>
    <Route path="/edit-problem/:id" component={ requireAuth(Pages.ProposePage) }/>
    <Route path="*" component={ NotFoundPage } />
  </Switch>
);

Routes.propTypes = {
  authenticated: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
        authenticated: !!state.auth.authenticated.content
      });

export default withRouter(
  connect(
    mapStateToProps
  )(Routes)
);
