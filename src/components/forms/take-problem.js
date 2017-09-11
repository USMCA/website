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

const CompetitionField = ({ input, meta, ...rest }) => (
        <CompetitionsSelect
          s={8}
          type={ competitionsInputOptions.MEMBER }
          { ...input }
          { ...rest } />
      );

class TakeProblemForm extends React.Component {
  onSubmit = ({ competition_id }) => {
    const { takeProblem, problem_id } = this.props;
    if (!competition_id) return;
    takeProblem(problem_id, competition_id);
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <form className="col s12" onSubmit={ handleSubmit(this.onSubmit) }>
        <Row>
          <div>
            <Field name="competition_id" component={ CompetitionField } />
          </div>
          <Col s={4}>
            <Button waves="light" className="teal darken-3" type="submit">Take</Button>
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

const TakeProblem = props => {
  const Component = connect(
    mapStateToProps, mapDispatchToProps
  )(
    reduxForm({
      form: `take-problem-${props.problem_id}`
    })(TakeProblemForm)
  );
  return <Component { ...props } />;
};

export default TakeProblem;
