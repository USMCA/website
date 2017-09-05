import React from "react";
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

const { SUCCESS, PENDING, ERROR, IDLE } = requestStatuses;

const ProblemField = ({ input, meta, getProposal, onChange, ...rest }) => (
  <Input 
    s={12} label="Problem ID to Add" 
    { ...input } { ...rest }
    onChange={ 
      (evt, val) => { 
        if (val) { getProposal(val); } 
        onChange(evt, val);
      }
    } />
);

class AddProblemForm extends React.Component {
  onSubmit = ({ problem_id }) => {
    const { addTestProb, test_id } = this.props;
    if (!problem_id) return;
    addTestProb(test_id, problem_id);
  }

  render() {
    const { 
            handleSubmit, 
            probData: { content, requestStatus, message },
            postData: { requestStatus: postStatus, message: errMessage },
            getProposal
          } = this.props,
          proposal = content;
    return (
      <form className="col s12" onSubmit={ handleSubmit(this.onSubmit) }>
        <Row>
          <div>
            <Field name="problem_id" component={ ProblemField } getProposal={ getProposal } />
          </div>
          { proposal && <ProblemPreview problem={ proposal } /> }
          <Col s={12}>
            <Error error={ postStatus === ERROR } message={ errMessage }/>
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
