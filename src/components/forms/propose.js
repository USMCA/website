import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Input, Button } from "react-materialize";
import { connect } from "react-redux";
import { Field, reduxForm, formValueSelector } from "redux-form";

import renderKaTeX from "../../katex";

const myContests = [
  {name : "Public database", subjects : ["Algebra", "Combinatorics", "Geometry", "Number Theory", "Other"]},
  {name : "CMIMC 2017", subjects : ["Algebra", "Combinatorics", "Computer Science", "Geometry", "Number Theory"]}
]

class ProposeForm extends React.Component {
  previewKaTeX = () => {
    if (this.statementField && this.statementField.value) {
      this.statementPreview.innerHTML = this.statementField.value;
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
    if (this.solutionField && this.solutionField.value) {
      this.solutionPreview.innerHTML = this.solutionField.value;
      this.solutionPreview.className = "katex-preview";
      renderKaTeX(this.solutionPreview);
    } else {
      this.solutionPreview.innerHTML = "";
      this.solutionPreview.className = "";
    }
  }

  render() {
    return (
      <form className="col s12">
        <Row>
          <Input type="select" label="Contest" s={4}>{
            myContests.map((contest, key) => (
              <option value={contest.name} key={key}>{contest.name}</option>
            ))
          }</Input>
          <Input type="select" label="Subject" s={4}>
            <option value="none">Select a subject</option>
            <option value="1">Option 1</option>
            <option value="2">Option 2</option>
            <option value="3">Option 3</option>
          </Input>
          <Input type="select" label="Difficulty" s={4}>
            <option value="none">Select a difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </Input>
        </Row>
        <Row>
          <Col s={6} className="input-field">
            <textarea
              id="statement"
              className="materialize-textarea"
              ref={ elem => { this.statementField = elem; } } />
            <label htmlFor="statement">Problem</label>
          </Col>
          <Col s={6}>
            <div ref={ elem => { this.statementPreview = elem; } }></div>
          </Col>
        </Row>
        <Row>
          <Input
            s={6} type="text" label="Answer"
            ref={ elem => { this.answerField = elem; } } />
          <Col s={6}>
            <div ref={ elem => { this.answerPreview = elem; } }></div>
          </Col>
        </Row>
        <Row>
          <Col s={6} className="input-field">
            <textarea
              id="solution"
              className="materialize-textarea"
              ref={ elem => { this.solutionField = elem; } }></textarea>
            <label htmlFor="solution">Solution</label>
          </Col>
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

export default ProposeForm;
