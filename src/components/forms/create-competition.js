import React from "react";
import PropTypes from "prop-types";
import { Input, Button } from "react-materialize";
import { Field, reduxForm } from "redux-form";
import { connect } from "react-redux";

import Spinner from "../spinner";
import Error from "../error";
import {
  compErrorHandler, requestCompetition
} from "../../actions";
import { requestStatuses } from "../../actions/types";

const NameInput = ({ input, meta, ...rest }) => (
        <Input 
          label="Competition name (e.g. Carnegie Mellon Informatics and Mathematics Competition)" 
          className="clear-top" { ...input } { ...rest }/>
      ),
      ShortNameInput = ({ input, meta, ...rest }) => (
        <Input 
          label="Short name (e.g. CMIMC)" 
          className="clear-top" { ...input } { ...rest } />
      ),
      WebsiteInput = ({ input, meta, ...rest }) => (
        <Input 
          label="Website (optional)" 
          className="clear-top" { ...input } { ...rest } />
      );

class CreateCompetitionForm extends React.Component {
  onSubmit = ({ name, shortName, website }) => {
    this.props.requestCompetition({ name, shortName, website });
  }

  render() {
    const { handleSubmit } = this.props;
    if (this.props.requestStatus === requestStatuses.SUBMITTED) {
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
        <Error error={ this.props.compError } message={ this.props.compMessage } />
        { 
          (
           this.props.requestStatus === requestStatuses.PENDING && 
           !this.props.compError
          ) && <Spinner /> 
        }
      </form> 
    );
  }
}

CreateCompetitionForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired,
  compError: PropTypes.bool.isRequired,
  compMessage: PropTypes.string,
  requestStatus: PropTypes.string.isRequired,
  requestCompetition: PropTypes.func.isRequired,
  compErrorHandler: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  compError: state.competitions.error,
  compMessage: state.competitions.message,
  requestStatus: state.competitions.requestStatus
});

const mapDispatchToProps = dispatch => ({
  requestCompetition: ({ name, shortName, website }) => {
    requestCompetition({ name, shortName, website })(dispatch);
  },
  compErrorHandler: (errMessage) => {
    compErrorHandler(dispatch, errMessage);
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
