import * as React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";

import Error from "../error";
import Spinner from "../spinner";
import { testSolve } from "../../actions";
import { PROB_TEST_SOLVE, requestStatuses } from "../../actions/types";
import { KaTeXInput } from "./utilities";

const { SUBMIT, PENDING, SUBMITTED, IDLE, ERROR } = requestStatuses;

class TestSolveForm extends React.Component {
  onSubmit = ({ solution }) => {
    const { problem_id, testSolve, errorHandler } = this.props;
    if (!solution) {
      return errorHandler("No solution provided.");
    }
    testSolve(problem_id, solution);
  }
  
  solutionField = ({ input, meta, ...rest }) => (
    <KaTeXInput 
      type="textarea" 
      label="Solution" 
      includeSubmit={true}
      { ...input } { ...rest } />
  );

  render() { 
    const { handleSubmit, probData: { requestStatus, message } } = this.props;
    return (
      <form onSubmit={ handleSubmit(this.onSubmit) }>
        <div style={{marginTop: "12px"}}>
          <Field name="solution" component={ this.solutionField } />
        </div>
      </form>
    );
  }
}

TestSolveForm.propTypes = {
  problem_id: PropTypes.string.isRequired,
  testSolve: PropTypes.func.isRequired,
  errorHandler: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  probData: state.problems.proposal
});
const mapDispatchToProps = dispatch => ({
  testSolve: (problem_id, solution) => {
    testSolve(problem_id, solution)(dispatch);
  },
  errorHandler: message => {
    dispatch({ 
      type: PROB_TEST_SOLVE, 
      payload: { requestStatus: ERROR, message }
    });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({ form: 'test-solve' })(TestSolveForm)
);
