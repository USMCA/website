import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Input, Button } from 'react-materialize';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import Error from "../error";
import Autocomplete from "../react-materialize-custom/Autocomplete";
import { signupUser } from "../../actions";
import { AUTH_USER, requestStatuses } from "../../actions/types";
const { SUCCESS, PENDING, SUBMITTED, IDLE, ERROR } = requestStatuses;

const universities = {
  "Carnegie Mellon University": null,
  "Harvard University": null,
  "Massachusetts Institute of Technology": null,
  "Princeton University": null,
  "University of California Berkeley": null
}

const NameInput = ({ input, meta, ...rest }) => (
        <Input type="text" label="Name" s={12} { ...input } { ...rest } />
      ),
      EmailInput = ({ input, meta, ...rest }) => (
        <Input type="email" label="Email" s={12} { ...input } { ...rest } />
      ),
      PasswordInput = ({ input, meta, ...rest }) => (
        <Input type="password" label="Password" s={12} { ...input } { ...rest } />
      ),
      PasswordConfirmInput = ({ input, meta, ...rest }) => (
        <Input type="password" label="Password (confirm)" s={12} { ...input } { ...rest } />
      ),
      UniversityInput = ({ input, meta, ...rest }) => (
        <Autocomplete
          s={12} title="University" { ...input } { ...rest } 
          data={ universities } limit={5} />
      );

class SignupForm extends React.Component {
  onSubmit = ({ name, email, password, passwordConfirm, university }) => {
    const { errorHandler, signupUser } = this.props;
    if (!name || !email || !password || !passwordConfirm || !university) {
      errorHandler("Please fill out all fields.");
    } else if (password !== passwordConfirm) {
      errorHandler("Passwords do not match.");
    } else {
      signupUser({ name, email, password, university });
    }
  }

  render() { 
    const { 
      handleSubmit, 
      authenticated: { content, requestStatus, message } 
    } = this.props;
    return (
      <form onSubmit={ handleSubmit(this.onSubmit) }>
        <Row className="placeholder-form">
          <div>
            <Field name="name" component={ NameInput } />
          </div>
          <div>
            <Field name="email" component={ EmailInput } />
          </div>
          <div>
            <Field name="password" component={ PasswordInput } />
          </div>
          <div>
            <Field name="passwordConfirm" component={ PasswordConfirmInput } />
          </div>
          <div>
            <Field name="university" component={ UniversityInput } />
          </div>
          <Col s={12}>
            <Button waves="light" className="teal darken-4 right">Sign Up</Button>
          </Col>
        </Row>
        <Error s={12} error={ requestStatus === ERROR } message={ message } />
      </form>
    );
  }
}

SignupForm.propTypes = {
  authenticated: PropTypes.object.isRequired,
  signupUser: PropTypes.func.isRequired,
  errorHandler: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  authenticated: state.auth.authenticated
});

const mapDispatchToProps = dispatch => ({
  errorHandler: message => {
    dispatch({ type: AUTH_USER, payload: { requestStatus: ERROR, message } });
  },
  signupUser: ({ name, email, password, university }) => {
    signupUser({ name, email, password, university })(dispatch);
  }
});

export default reduxForm({
  /* unique name for form */
  form: 'signup'
})(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SignupForm)
);
