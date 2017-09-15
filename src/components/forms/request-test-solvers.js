import * as React from "react";
import PropTypes from "prop-types";
import { Row, Col, Input, Button } from "react-materialize";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { Link } from "react-router-dom";

import { requestTS } from "../../actions";
import { requestStatuses } from "../../actions/types";
import Spinner from "../spinner";
import Error from "../error";
import {
  competitionsInputOptions,
  CompetitionsSelect,
} from "./utilities";

const { SUCCESS, PENDING, ERROR, IDLE } = requestStatuses;

const NumberField = ({ input, meta, ...rest }) => (
        <Input 
          type="number" s={8} 
          label="Number of Test Solvers"
          min={0}
          { ...input }
          { ...rest } />
      );

class RequestTSForm extends React.Component {
  onSubmit = ({ number }) => {
    const { requestTS, contest_id } = this.props;
    if (!contest_id) return;
    requestTS(contest_id, number);
  }

  render() {
    const { 
      handleSubmit, 
      requestTSData: { requestStatus, message } 
    } = this.props;
    return (requestStatus === SUCCESS) ? (
      <p>Request submitted!</p>
    ) : (
      <form className="col s12" onSubmit={ handleSubmit(this.onSubmit) }>
        <Row>
          <div>
            <Field name="number" component={ NumberField } />
          </div>
          <Col s={4}>
            <Button waves="light" className="teal darken-3" type="submit">Request</Button>
          </Col>
        </Row>
        <Error error={ requestStatus === ERROR } message={ message } />
        { (requestStatus === PENDING) && <Spinner /> }
      </form>
    );
  }
}

const mapStateToProps = state => ({
        requestTSData: state.contests.requestTS,
      }),
      mapDispatchToProps = dispatch => ({
        requestTS: (contest_id, number) => {
          requestTS(contest_id, number)(dispatch);
        }
      });

export default connect(
  mapStateToProps, mapDispatchToProps
)(
  reduxForm({
    form: 'request-test-solver'
  })(RequestTSForm)
);
