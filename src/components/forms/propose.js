import * as React from "react";
import PropTypes from "prop-types";
import { Row, Col, Input, Button } from "react-materialize";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { Link } from "react-router-dom";

import renderKaTeX from "../../katex";
import { putProposal, postProposal } from "../../actions";
import { PROB_POST, requestStatuses } from "../../actions/types";
import Spinner from "../spinner";
import Error from "../error";
import {
  competitionsInputOptions,
  CompetitionsSelect,
  SubjectsInput
} from "./utilities";
import { FlameInput } from "../utilities";
import ControlledInput from "../react-materialize-custom/ControlledInput";

const { SUCCESS, PENDING, SUBMITTED, IDLE, ERROR } = requestStatuses;

class ProposeForm extends React.Component {
  onSubmit = ({
    competition_id, subject, difficulty, statement, answer, solution
  }) => {
    const { errorHandler, postProposal, putProposal, edit } = this.props;
    if (!statement) {
      errorHandler('Please fill out required fields.');
    } else if (edit) {
      putProposal({ statement, answer, solution });
    } else {
      postProposal({
        competition_id, subject, difficulty, statement, answer, solution
      });
    }
  }

  resetForm = () => {
    this.props.resetProposalForm();
  }

  previewKaTeX = () => {
    if (this.statementField && this.statementField.state.value) {
      this.statementPreview.innerHTML = this.statementField.state.value;
      this.statementPreview.className = "katex-preview";
      renderKaTeX(this.statementPreview);
    } else {
      this.statementPreview.innerHTML = "";
      this.statementPreview.className = "";
    }
    if (this.answerField && this.answerField.state.value) {
      this.answerPreview.innerHTML = this.answerField.state.value;
      this.answerPreview.className = "katex-preview";
      renderKaTeX(this.answerPreview);
    } else {
      this.answerPreview.innerHTML = "";
      this.answerPreview.className = "";
    }
    if (this.solutionField && this.solutionField.state.value) {
      this.solutionPreview.innerHTML = this.solutionField.state.value;
      this.solutionPreview.className = "katex-preview";
      renderKaTeX(this.solutionPreview);
    } else {
      this.solutionPreview.innerHTML = "";
      this.solutionPreview.className = "";
    }
  }

  competitionField = ({ input, meta, ...rest }) => (
    <CompetitionsSelect
      s={4}
      type={ competitionsInputOptions.MEMBER }
      publicDatabase={ true }
      disabled={ this.props.edit }
      { ...input }
      { ...rest } />
  )

  subjectField = ({ input, meta, ...rest }) => (
    <SubjectsInput s={4} { ...input } { ...rest } disabled={ this.props.edit } />
  )

  difficultyField = ({ input, meta, ...rest }) => (
    <div><p style={{color: "#9e9e9e", fontSize: ".8rem"}}>Difficulty</p><FlameInput value={0} /></div>
  )

  statementInput = ({ input, meta, ...rest }) => (
    <ControlledInput
      s={6} type="textarea" label="Problem"
      { ...input } { ...rest }
      ref={ elem => { this.statementField = elem; } } />
  )

  answerInput = ({ input, meta, ...rest }) => (
    <ControlledInput
      s={6} type="text" label="Answer (optional)"
      { ...input } { ...rest }
      ref={ elem => { this.answerField = elem; } } />
  )

  solutionInput = ({ input, meta, ...rest }) => (
    <ControlledInput
      s={6} type="textarea" label="Solution (optional)"
      { ...input } { ...rest }
      ref={ elem => { this.solutionField = elem; } } />
  )

  render() {
    const { handleSubmit, edit, postStatus, putStatus } = this.props,
          { requestStatus, message } = edit ? putStatus : postStatus;

    return (!edit && requestStatus === SUCCESS) ? (
      <div>
        <p>Problem submitted! Click <Link to="/propose" onClick={ this.resetForm }>here</Link> to propose another problem.</p>
      </div>
    ) : (
      <form className="col s12" onSubmit={ handleSubmit(this.onSubmit) }>
        <Row>
          <div>
            <Field name="competition_id" component={ this.competitionField } />
          </div>
          <div>
            <Field name="subject" component={ this.subjectField } />
          </div>
          <div>
            <Field name="difficulty" component={ this.difficultyField } />
          </div>
        </Row>
        <Row>
          <div>
            <Field
              name="statement"
              component={ this.statementInput } />
          </div>
          <Col s={6}>
            <div ref={ elem => { this.statementPreview = elem; } }></div>
          </Col>
        </Row>
        <Row>
          <div>
            <Field
              name="answer"
              component={ this.answerInput } />
          </div>
          <Col s={6}>
            <div ref={ elem => { this.answerPreview = elem; } }></div>
          </Col>
        </Row>
        <Row>
          <div>
            <Field
              name="solution"
              component={ this.solutionInput } />
          </div>
          <Col s={6}>
            <div ref={ elem => { this.solutionPreview = elem; } }></div>
          </Col>
        </Row>
        <Row>
          <Col s={2} offset={"s8"}>
            <a className="waves-effect waves-light btn teal darken-3" onClick={ this.previewKaTeX }>Preview</a>
          </Col>
          <Col s={2}>
            <Button waves="light" className="teal darken-3" type="submit">{ edit ? "Save" : "Submit" }</Button>
          </Col>
        </Row>
        <Row>
          <Error error={ requestStatus === ERROR } message={ message } />
          { requestStatus === PENDING && <Spinner /> }
          { edit && requestStatus === SUCCESS && (
              <p>Problem saved.</p>
            )
          }
        </Row>
      </form>
    );
  }
}

ProposeForm.propTypes = {
  postStatus: PropTypes.object.isRequired,
  putStatus: PropTypes.object.isRequired,
  postProposal: PropTypes.func.isRequired,
  resetProposalForm: PropTypes.func.isRequired,
  errorHandler: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  proposal: PropTypes.object, // if populated, prefill proposal with this data
  edit: PropTypes.bool // indicates whether in edit mode or propose mode
};

const mapStateToProps = state => ({
        postStatus: state.problems.postProposal,
        putStatus: state.problems.putProposal,
      }),
      mapDispatchToProps = (dispatch, props) => ({
        postProposal: ({
          competition_id, subject, difficulty, statement, answer, solution
        }) => {
          postProposal({
            competition_id, subject, difficulty, statement, answer, solution
          })(dispatch);
        },
        putProposal: ({ statement, answer, solution }) => {
          putProposal(props.proposal._id, {
            statement, answer, solution
          })(dispatch);
        },
        resetProposalForm: () => {
          dispatch({ type: PROB_POST, payload: { requestStatus: IDLE } });
        },
        errorHandler: message => {
          dispatch({
            type: PROB_POST,
            payload: { requestStatus: ERROR, message }
          });
        }
      });

const Initialized = props => {
  console.log((props.proposal || {}).subject);
  const Component = reduxForm({
    form: 'propose',
    initialValues: props.proposal ? {
      statement: props.proposal.statement,
      answer: props.proposal.answer,
      solution: (props.proposal.soln || {}).body,
      competition_id: (props.proposal.competition || {})._id,
      subject: props.proposal.subject
    } : null
  })(ProposeForm);
  return <Component { ...props } />;
};

export default connect(
  mapStateToProps, mapDispatchToProps
)(Initialized);
