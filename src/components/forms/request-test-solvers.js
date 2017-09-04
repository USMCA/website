import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Input, Button } from "react-materialize";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { Link } from "react-router-dom";

import { takeProblem } from "../../actions";
import Spinner from "../spinner";
import Error from "../error";
import {
  competitionsInputOptions,
  CompetitionsSelect,
} from "./utilities";

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
    const { takeProblem, contest_id } = this.props;
    console.log(number); return;
    if (!competition_id) return;
    takeProblem(problem_id, competition_id);
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <form className="col s12" onSubmit={ handleSubmit(this.onSubmit) }>
        <Row>
          <div>
            <Field name="number" component={ NumberField } />
          </div>
          <Col s={4}>
            <Button waves="light" className="teal darken-3" type="submit">Request</Button>
          </Col>
        </Row>
      </form>
    );
  }
}

const mapStateToProps = state => ({
        probStatus: state.problems.postProposal,
      }),
      mapDispatchToProps = dispatch => ({
        takeProblem: (problem_id, competition_id) => {
          takeProblem(problem_id, competition_id)(dispatch);
        }
      });

export default connect(
  mapStateToProps, mapDispatchToProps
)(
  reduxForm({
    form: 'request-test-solver'
  })(RequestTSForm)
);
