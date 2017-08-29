import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Input, Button } from 'react-materialize';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import Error from "../error";
import { loginUser } from "../../actions";
import { AUTH_USER, requestStatuses } from "../../actions/types";
const { SUCCESS, PENDING, SUBMITTED, IDLE, ERROR } = requestStatuses;

const EmailInput = ({ input, meta, ...rest }) => (
        <Input type="email" placeholder="Email" s={12} { ...input } { ...rest } />
      ),
      PasswordInput = ({ input, meta, ...rest }) => (
        <Input type="password" placeholder="Password" s={12} { ...input } { ...rest } />
      );

class LoginForm extends React.Component {
  componentWillMount = () => {
    /* go to home if logged in */
    if (this.props.authenticated.content) this.props.history.push('/');
  }

  componentWillUpdate = (nextProps) => {
    /* go to home if logged in */
    if (nextProps.authenticated.content) this.props.history.push('/');
  }

  onSubmit = ({ email, password }) => {
    const { errorHandler, loginUser } = this.props;
    if (!email || !password) errorHandler("Please fill out all fields.");
    else loginUser({ email, password });
  };

  render() {
    const { 
      handleSubmit, 
      authenticated: { content, message, requestStatus } 
    } = this.props;
    return (
      <form onSubmit={ handleSubmit(this.onSubmit) }>
        <Row className="placeholder-form">
          <div>
            <Field name="email" component={ EmailInput } />
          </div>
          <div>
            <Field name="password" component={ PasswordInput } />
          </div>
          <Col s={12}>
            <Button waves="light" className="teal darken-4 right" disabled={ content }>
              Log In
            </Button>
          </Col>
        </Row>
        <Error s={12} error={ !!content } message="You are already logged in." />
        <Error s={12} error={ requestStatus === ERROR } message={ message } />
      </form>
    );
  }
}

LoginForm.propTypes = {
  authenticated: PropTypes.object.isRequired,
  loginUser: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  authenticated: state.auth.authenticated,
});

const mapDispatchToProps = dispatch => ({
  errorHandler: message => {
    dispatch({ type: AUTH_USER, payload: { requestStatus: ERROR, message } });
  },
  loginUser: ({ email, password }) => {
    loginUser({ email, password })(dispatch);
  }
});

export default withRouter(
  reduxForm({
    /* unique name for form */
    form: 'login'
  })(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(LoginForm)
  )
);
