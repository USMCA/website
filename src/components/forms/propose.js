import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Input, Button } from "react-materialize";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";

import renderKaTeX from "../../katex";
import { 
  competitionsInputOptions,
  CompetitionsSelect, 
  SubjectsInput 
} from "./utilities";
import ControlledInput from "../react-materialize-custom/ControlledInput";

const CompetitionField = ({ input, meta, ...rest }) => (
        <CompetitionsSelect
          s={4} 
          type={ competitionsInputOptions.MEMBER } 
          { ...input } 
          { ...rest } />
      ),
      SubjectField = ({ input, meta, ...rest }) => (
        <SubjectsInput s={4} { ...input } { ...rest } />
      ),
      DifficultyField = ({ input, meta, ...rest }) => (
        <Input type="select" label="Difficulty" s={4} { ...input } { ...rest }>
          <option value="">Select a difficulty</option>
          <option value={1}>1 (Easy)</option>
          <option value={2}>2 (Easy Medium)</option>
          <option value={3}>3 (Medium)</option>
          <option value={4}>4 (Medium Hard)</option>
          <option value={5}>5 (Hard)</option>
        </Input>
      );

class ProposeForm extends React.Component {
  onSubmit = value => {
    console.log(value);
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

  render() {
    const { handleSubmit } = this.props;
    return (
      <form className="col s12" onSubmit={ handleSubmit(this.onSubmit) }>
        <Row>
          <div>
            <Field name="competition_id" component={ CompetitionField } />
          </div>
          <div>
            <Field name="subject" component={ SubjectField } />
          </div>
          <div>
            <Field name="difficulty" component={ DifficultyField } />
          </div>
        </Row>
        <Row>
          <div>
            <Field 
              name="statement" 
              component={ ({ input, meta, ...rest }) => (
                <ControlledInput 
                  s={6} type="textarea" label="Problem"
                  { ...input } { ...rest }
                  ref={ elem => { this.statementField = elem; } } />
              ) } />
          </div>
          <Col s={6}>
            <div ref={ elem => { this.statementPreview = elem; } }></div>
          </Col>
        </Row>
        <Row>
          <div>
            <Field 
              name="answer" 
              component={ ({ input, meta, ...rest }) => (
                <ControlledInput 
                  s={6} type="text" label="Answer"
                  { ...input } { ...rest }
                  ref={ elem => { this.answerField = elem; } } />
              ) } />
          </div>
          <Col s={6}>
            <div ref={ elem => { this.answerPreview = elem; } }></div>
          </Col>
        </Row>
        <Row>
          <div>
            <Field 
              name="solution" 
              component={ ({ input, meta, ...rest }) => (
                <ControlledInput 
                  s={6} type="textarea" label="Solution"
                  { ...input } { ...rest }
                  ref={ elem => { this.solutionField = elem; } } />
              ) } />
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
            <Button waves="light" className="teal darken-3" type="submit">Submit</Button>
          </Col>
        </Row>
      </form>
    );
  }
}

export default reduxForm({ 
  form: 'propose'
})(ProposeForm);
