import * as React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Input, Button } from 'react-materialize';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import Error from "../error";
import Spinner from "../spinner";
import { changePass } from "../../actions";
import { CHANGE_PASS, requestStatuses } from "../../actions/types";
const { SUCCESS, PENDING, SUBMITTED, IDLE, ERROR } = requestStatuses;

const CurrentPasswordField = ({ input, meta, ...rest }) => (
        <Input type="password" placeholder="Current Password" s={12} { ...input } { ...rest } />
      ),
      NewPasswordField = ({ input, meta, ...rest }) => (
        <Input type="password" placeholder="New Password" s={12} { ...input } { ...rest } />
      ),
      NewPasswordConfirmField = ({ input, meta, ...rest }) => (
        <Input type="password" placeholder="New Password (confirm)" s={12} { ...input } { ...rest } />
      );

class ChangePasswordForm extends React.Component {
  onSubmit = ({ currPass, newPass, newPassConfirm }) => {
    const { errorHandler, changePass } = this.props;
    if (!currPass || !newPass || !newPassConfirm) {
      errorHandler("Please fill out all fields.");
    } else if (newPass !== newPassConfirm) {
      errorHandler("Passwords do not match.");
    } else {
      changePass({ currPass, newPass });
    }
  };

  render() {
    const { 
      handleSubmit, 
      data: { content, requestStatus, message }
    } = this.props;
    return (requestStatus === SUCCESS) ? (
      <div>
        <p>Successfully updated password!</p>
      </div>
    ) : (
      <form onSubmit={ handleSubmit(this.onSubmit) }>
        <Row className="placeholder-form">
          <div>
            <Field name="currPass" component={ CurrentPasswordField } />
          </div>
          <div>
            <Field name="newPass" component={ NewPasswordField } />
          </div>
          <div>
            <Field name="newPassConfirm" component={ NewPasswordConfirmField } />
          </div>
          <Col s={12}>
            <Button waves="light" className="teal darken-4 right">
              Confirm
            </Button>
          </Col>
        </Row>
        <Error s={12} error={ requestStatus === ERROR } message={ message } />
        {
          (requestStatus === PENDING) && <Spinner />
        }
      </form>
    );
  }
}

ChangePasswordForm.propTypes = {
  data: PropTypes.object.isRequired,
  changePass: PropTypes.func.isRequired,
  errorHandler: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  data: state.auth.changePassword,
});

const mapDispatchToProps = dispatch => ({
  errorHandler: message => {
    dispatch({ type: CHANGE_PASS, payload: { requestStatus: ERROR, message } });
  },
  changePass: ({ currPass, newPass }) => {
    changePass({ currPass, newPass })(dispatch);
  }
});

export default reduxForm({
  /* unique name for form */
  form: 'change-password'
})(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ChangePasswordForm)
);
