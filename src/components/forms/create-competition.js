import React, { Component } from "react";
import PropTypes from "prop-types";
import { Input, Button } from "react-materialize";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";

import Spinner from "../spinner";
import Error from "../error";
import { requestCompetition } from "../../actions";
import { COMP_REQ, requestStatuses } from "../../actions/types";

const { SUCCESS, PENDING, ERROR, SUBMITTED, IDLE } = requestStatuses;

const NameInput = ({ input, meta, ...rest }) => (
        <Input 
          label="Competition name (e.g. Carnegie Mellon Informatics and Mathematics Competition)" 
          className="clear-top" { ...input } { ...rest }/>
      ),
      ShortNameInput = ({ input, meta, ...rest }) => (
        <Input 
          label="Short name (e.g. CMIMC) (optional)" 
          className="clear-top" { ...input } { ...rest } />
      ),
      WebsiteInput = ({ input, meta, ...rest }) => (
        <Input 
          label="Website (optional)" 
          className="clear-top" { ...input } { ...rest } />
      );

class CreateCompetitionForm extends Component {
  onSubmit = ({ name, shortName, website }) => {
    const { requestCompetition, errorHandler } = this.props;
    if (!name) errorHandler('The name field is required.');
    else requestCompetition({ name, shortName, website });
  }

  render() {
    const { handleSubmit, data: { requestStatus, message } } = this.props;
    if (requestStatus === SUBMITTED) {
      return (
        <div>
          <p>Request submitted! The admins will review your request.</p>
        </div>
      );
    }
    return (
      <form onSubmit={ handleSubmit(this.onSubmit) }>
        <div>
          <Field name="name" component={ NameInput } />
        </div>
        <div>
          <Field name="shortName" component={ ShortNameInput } />
        </div>
        <div>
          <Field name="website" component={ WebsiteInput } />
        </div>
        <p>
          Your request to create a competition will be reviewed by an admin. <Button type="submit" className="right teal darken-3">Create</Button>
          <br className="clear-float" />
        </p>
        <Error error={ requestStatus === ERROR } message={ message } />
        { 
          (requestStatus === PENDING) && <Spinner /> 
        }
      </form> 
    );
  }
}

CreateCompetitionForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  requestCompetition: PropTypes.func.isRequired,
  errorHandler: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  data: state.competitions.requestCompetition
});

const mapDispatchToProps = dispatch => ({
  requestCompetition: ({ name, shortName, website }) => {
    requestCompetition({ name, shortName, website })(dispatch);
  },
  errorHandler: message => {
    dispatch({ type: COMP_REQ, payload: { requestStatus: ERROR, message } });
  },
});

export default reduxForm({
  /* unique name for form */
  form: 'create-competition'
})(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CreateCompetitionForm)
);
