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
  CompetitionsSelect, 
  LocationArrayInput
} from "./utilities";
import { postContest } from "../../actions";
import { CONTEST_POST, requestStatuses } from "../../actions/types";

const { SUCCESS, PENDING, SUBMITTED, ERROR, IDLE } = requestStatuses;

const CompetitionInput = ({ input, meta, ...rest }) => (
        <CompetitionsSelect type={ competitionsInputOptions.DIRECTOR } { ...input } { ...rest } />
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
      return this.props.errorHandler('Please fill out all fields.');
    }
    this.props.postContest({ competition_id, name, date, locations });
  }

  resetForm = () => {
    //@TODO clear form inputs
    this.props.resetContestForm();
  }

  render() {
    const { handleSubmit, data: { requestStatus, message } } = this.props;
    return requestStatus === SUCCESS ? (
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
          <Error error={ requestStatus === ERROR } message={ message } />
          { 
            (requestStatus === PENDING) && <Spinner /> 
          }
        </Row>
      </form>
    );
  }
}

CreateContestForm.propTypes = {
  postContest: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
        data: state.contests.createContest
      }),
      mapDispatchToProps = dispatch => ({
        errorHandler: message => {
          dispatch({ 
            type: CONTEST_POST, 
            payload: {
              requestStatus: ERROR,
              message
            }
          });
        },
        resetContestForm: () => {
          dispatch({
            type: CONTEST_POST,
            payload: {
              requestStatus: IDLE,
            }
          });
        },
        postContest: ({ competition_id, name, date, locations }) => {
          postContest({ competition_id, name, date, locations})(dispatch);
        }
      });

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    form: 'create-contest'
  })(CreateContestForm)
);
