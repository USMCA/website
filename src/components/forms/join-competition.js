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
import {
  joinCompetition
} from "../../actions";
import { COMP_REQ_JOIN, requestStatuses } from "../../actions/types";

const { SUCCESS, PENDING, ERROR, SUBMITTED, IDLE } = requestStatuses;

const CompetitionField = ({ input, meta, ...rest }) => (
        <CompetitionsInput type={ competitionsInputOptions.ALL } { ...input } { ...rest } />
      );

class JoinCompetitionForm extends React.Component {
  onSubmit = ({ competition_id }) => {
    if (!competition_id) {
      return this.props.errorHandler('Please fill out all fields.');
    }
    this.props.joinCompetition({ competition_id });
  }

  resetForm = () => {
    this.props.resetCreateContestForm();
  }

  render() {
    const { handleSubmit, data: { requestStatus, message } } = this.props;
    return requestStatus === SUCCESS ? (
      <div>
        <p>Request submitted. Your request will be reviewed by the directors of the competition</p>
      </div>
    ) : (
      <form onSubmit={ handleSubmit(this.onSubmit) }>
        <Row>
          <div>
            <Field name="competition_id" component={ CompetitionField } />
          </div>
          <RightButtonPanel>
            <Button type="submit" className="teal darken-3">Join</Button>
          </RightButtonPanel><br />
          <Error error={ requestStatus === ERROR } message={ message } />
          {
            requestStatus === PENDING && <Spinner />
          }
        </Row>
      </form>
    );
  }
}

JoinCompetitionForm.propTypes = {
  data: PropTypes.object.isRequired,
  joinCompetition: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
        data: state.competitions.joinCompetition
      }),
      mapDispatchToProps = dispatch => ({
        joinCompetition: ({ competition_id }) => {
          joinCompetition(competition_id)(dispatch);
        },
        errorHandler: message => {
          dispatch({
            type: COMP_REQ_JOIN,
            payload: {
              requestStatus: ERROR,
              message
            }
          });
        }
      });

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    form: 'join-competition'
  })(JoinCompetitionForm)
);
