import * as React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Card, Modal } from "react-materialize";

import LoginForm from "./forms/login";
import { logoutUser } from '../actions';

const Header = ({ authenticated, logout }) => (
  <header>
    <nav className="teal darken-4">
      <Link to="/" className="brand-logo left">USMCA</Link>
      <ul id="nav-mobile" className="right">
        { authenticated && (<li><Link to="/">Home</Link></li>) }
        { authenticated && (<li><Link to="/propose">Propose</Link></li>) }
        { authenticated && (<li><Link to="/test-solve">Test Solve</Link></li>) }
        { authenticated && (<li><Link to="/public-database">Public Database</Link></li>) }
        { authenticated && (<li><Link to="/" onClick={ logoutUser }>Log Out</Link></li>) }
        { !authenticated && (<li><Link to="/login">Log In</Link></li>) }
      </ul>
    </nav>
  </header>
);

Header.propTypes = {
  authenticated: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  authenticated: !!state.auth.authenticated.content
});

const mapDispatchToProps = dispatch => ({
  logout: () => logoutUser(dispatch)
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
