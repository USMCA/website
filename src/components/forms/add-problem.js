import React, { Component } from "react";
import PropTypes from "prop-types";
import { Row, Col, Input, Button } from "react-materialize";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { Link } from "react-router-dom";

import { getProposal, addTestProb } from "../../actions";
import { requestStatuses } from "../../actions/types";
import Spinner from "../spinner";
import Error from "../error";
import { ProblemPreview, RightButtonPanel } from "../utilities";
import ControlledInput from "../react-materialize-custom/ControlledInput";

const { SUCCESS, PENDING, ERROR, IDLE } = requestStatuses;

class AddProblemForm extends Component {
  onSubmit = ({ problem_id }) => {
    const { addTestProb, test_id } = this.props;
    if (!problem_id) return;
    addTestProb(test_id, problem_id);
  }

  problemField = ({ input, meta, onChange, ...rest }) => {
    const { getProposal } = this.props;
    return (
      <ControlledInput 
        ref={ elem => { this.problemFieldRef = elem; } }
        s={12} label="Problem ID to Add" 
        { ...input } { ...rest }
        onChange={ 
          (evt, val) => { 
            if (val) { getProposal(val); }
            onChange(evt, val);
          }
        } />
    );
  }

  render() {
    const { 
            handleSubmit, 
            probData: { content, requestStatus, message },
            postData: { requestStatus: postStatus, message: postMessage },
            getProposal
          } = this.props,
          proposal = content;
    return (
      <form className="col s12" onSubmit={ handleSubmit(this.onSubmit) }>
        <Row>
          <div>
            <Field name="problem_id" component={ this.problemField } />
          </div>
          { proposal && <ProblemPreview problem={ proposal } /> }
          <Col s={12}>
            <Error error={ postStatus === ERROR } message={ postMessage }/>
          </Col>
          <Col s={12}>
            { (postStatus === SUCCESS) && <p>Added problem to the test!</p> }
          </Col>
          <RightButtonPanel>
            <Button waves="light" className="teal darken-3" type="submit">Add</Button>
          </RightButtonPanel>
        </Row>
      </form>
    );
  }
}

const mapStateToProps = state => ({
  probData: state.problems.proposal,
  postData: state.contests.addTestProb
});
const mapDispatchToProps = dispatch => ({
  getProposal: id => { getProposal(id)(dispatch); },
  addTestProb: (test_id, problem_id) => { 
    addTestProb(test_id, problem_id)(dispatch); 
  }
});

export default connect(
  mapStateToProps, mapDispatchToProps
)(
  reduxForm({
    form: 'add-problem'
  })(AddProblemForm)
);
