import React from "react";
import PropTypes from "prop-types";
import { Field, reduxForm } from "redux-form";

import { testSolve } from "../../actions";
import { KaTeXInput } from "./utilities";

class TestSolveForm extends React.Component {
  onSubmit = ({ solution }) => {
    const { problem_id, testSolve } = this.props;
    console.log(solution);
    return;
  }

  render() { 
    const { handleSubmit } = this.props;
    return (
      <form onSubmit={ handleSubmit(this.onSubmit) }>
        <div style={{marginTop: "12px"}}>
          <Field name="solution" component={ ({ input, meta, ...rest }) => (
            <KaTeXInput 
              type="textarea" 
              label="Solution" 
              includeSubmit={true}
              { ...input } { ...rest } />
          ) } />
        </div>
      </form>
    );
  }
}

TestSolveForm.propTypes = {
  problem_id: PropTypes.string.isRequired,
  testSolve: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => ({
  testSolve: (problem_id, solution) => {
    testSolve(problem_id, solution)(dispatch);
  }
});

export default TestSolveForm;
