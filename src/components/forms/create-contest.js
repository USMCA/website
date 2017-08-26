import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { Input, Row, Button } from "react-materialize";

import Spinner from "../spinner";
import Error from "../error";
import { RightButtonPanel } from "../utilities";
import { 
  competitionsInputOptions, 
  CompetitionsInput, 
  LocationArrayInput
} from "./utilities";
import {
  contestErrorHandler, 
  resetCreateContestForm,
  postContest
} from "../../actions";
import { requestStatuses } from "../../actions/types";

const CompetitionInput = ({ input, meta, ...rest }) => (
        <CompetitionsInput type={ competitionsInputOptions.DIRECTOR } { ...input } { ...rest } />
      ),
      NameInput = ({ input, meta, ...rest }) => (
        <Input s={12} label="Name" { ...input } { ...rest } />
      ),
      DateInput = ({ input, meta, ...rest }) => (
        <Input s={12} label="Date" type="date" { ...input } { ...rest } />
      ),
      LocationsInput = ({ input, meta, ...rest }) => (
        <LocationArrayInput { ...input } { ...rest } />
      );

class CreateContestForm extends React.Component { 
  onSubmit = ({ competition_id, name, date, locations }) => {
    if (!competition_id || !name || !date || !locations) {
      return this.props.contestErrorHandler('Please fill out all fields.');
    }
    this.props.postContest({ competition_id, name, date, locations });
  }

  resetForm = () => {
    this.props.resetCreateContestForm();
  }

  render() {
    const { 
      handleSubmit, 
      contestError, 
      contestMessage, 
      resetForm,
      requestStatus 
    } = this.props;
    return requestStatus === requestStatuses.SUCCESS ? (
      <div>
        <p>Contest created! Click <a onClick={ this.resetForm }>here</a> to make another contest.</p>
      </div>
    ) : (
      <form onSubmit={ handleSubmit(this.onSubmit) }>
        <Row>
          <div>
            <Field name="competition_id" component={ CompetitionInput } />
          </div>
          <div>
            <Field name="name" component={ NameInput } />
          </div>
          <div>
            <Field name="date" component={ DateInput } />
          </div>
          <div>
            <Field name="locations" component={ LocationsInput } />
          </div>
          <RightButtonPanel>
            <Button type="submit" className="teal darken-3">Create</Button>
          </RightButtonPanel>
          <Error error={ contestError } message={ contestMessage } />
          { 
            (
              requestStatus === requestStatuses.PENDING && !contestError
            ) && <Spinner /> 
          }
        </Row>
      </form>
    );
  }
}

CreateContestForm.propTypes = {
  contestError: PropTypes.bool.isRequired,
  contestMessage: PropTypes.string,
  requestStatus: PropTypes.string.isRequired,
  contestErrorHandler: PropTypes.func.isRequired,
  postContest: PropTypes.func.isRequired,
  resetCreateContestForm: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
        contestError: state.contests.error,
        contestMessage: state.contests.message,
        requestStatus: state.contests.requestStatus
      }),
      mapDispatchToProps = dispatch => ({
        contestErrorHandler: errorMessage => {
          contestErrorHandler(dispatch, errorMessage);
        },
        postContest: ({ competition_id, name, date, locations }) => {
          postContest({ competition_id, name, date, locations})(dispatch);
        },
        resetCreateContestForm: () => {
          resetCreateContestForm(dispatch);
        }
      });

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    form: 'create-contest'
  })(CreateContestForm)
);
