import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Input, Button } from 'react-materialize';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import Error from "../error";
import Autocomplete from "../react-materialize-custom/Autocomplete";
import { authErrorHandler, signupUser } from "../../actions";

const universities = {
  "Carnegie Mellon University": null,
  "Harvard University": null,
  "Massachusetts Institute of Technology": null,
  "Princeton University": null,
  "University of California Berkeley": null
}

const NameInput = ({ input, meta, ...rest }) => (
        <Input type="text" placeholder="Name" s={12} { ...input } { ...rest } />
      ),
      EmailInput = ({ input, meta, ...rest }) => (
        <Input type="email" placeholder="Email" s={12} { ...input } { ...rest } />
      ),
      PasswordInput = ({ input, meta, ...rest }) => (
        <Input type="password" placeholder="Password" s={12} { ...input } { ...rest } />
      ),
      PasswordConfirmInput = ({ input, meta, ...rest }) => (
        <Input type="password" placeholder="Password (confirm)" s={12} { ...input } { ...rest } />
      ),
      UniversityInput = ({ input, meta, ...rest }) => (
        <Autocomplete
          s={12} placeholder="University" { ...input } { ...rest } 
          data={ universities } limit={5} />
      );

class SignupForm extends React.Component {
  onSubmit = ({ name, email, password, passwordConfirm, university }) => {
    if (!name || !email || !password || !passwordConfirm || !university) {
      this.props.authErrorHandler("Please fill out all fields.");
    } else if (password !== passwordConfirm) {
      this.props.authErrorHandler("Passwords do not match.");
    } else {
      this.props.signupUser({ name, email, password, university });
    }
  }

  render() { 
    const { handleSubmit, authError, authMessage } = this.props;
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
        <Error s={12} error={ authError } message={ authMessage } />
      </form>
    );
  }
}

SignupForm.propTypes = {
  authError: PropTypes.bool.isRequired,
  authMssage: PropTypes.string,
  authErrorHandler: PropTypes.func.isRequired,
  signupUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  authError: state.auth.error,
  authMessage: state.auth.message
});

const mapDispatchToProps = dispatch => ({
  authErrorHandler: message => {
    authErrorHandler(dispatch, message);
  },
  signupUser: values => {
    signupUser(values)(dispatch);
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
