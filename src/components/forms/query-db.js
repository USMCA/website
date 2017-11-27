import * as React from "react";
import PropTypes from "prop-types";
import { Row, Col, Input, Button } from "react-materialize";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { Link } from "react-router-dom";

import renderKaTeX from "../../katex";
import { fetchDatabase } from "../../actions";
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

class QueryDBForm extends React.Component {
  onSubmit = ({ subject, difficulty }) => {
    const { fetchDatabase } = this.props;
    fetchDatabase({ subject, difficulty });
  }

  subjectField = ({ input, meta, ...rest }) => (
    <SubjectsInput m={5} s={12} { ...input } { ...rest } />
  )

  difficultyField = ({ input, meta, ...rest }) => (
    <ControlledInput { ...input } { ...rest } m={5} s={12} type="select" label="Difficulty" multiple>
      <option value="" disabled>Choose your option</option>
      <option value="0">Unrated</option>
      <option value="1">1 (early-mid AMC)</option>
      <option value="2">2 (mid-late AMC)</option>
      <option value="3">3 (late AMC-early AIME)</option>
      <option value="4">4 (mid AIME)</option>
      <option value="5">5 (late AIME-early Olympiad)</option>
      <option value="6">6 (Olympiad)</option>
    </ControlledInput>
  )

  render() {
    const { handleSubmit } = this.props;

    return (
      <form className="col s12" onSubmit={ handleSubmit(this.onSubmit) }>
        <Row>
          <div>
            <Field name="subject" component={ this.subjectField } />
          </div>
          <div>
            <Field name="difficulty" component={ this.difficultyField } type="select-multiple" />
          </div>
          <div>
            <Col m={2} s={12}>
              <Button waves="light" className="teal darken-3" type="submit">Search</Button>
            </Col>
          </div>
        </Row>
      </form>
    );
  }
}

QueryDBForm.propTypes = {
  competition_id: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
      }),
      mapDispatchToProps = (dispatch, props) => ({
        fetchDatabase: ({ subject, difficulty }) => {
          fetchDatabase(props.competition_id, { subject, difficulty })(dispatch);
        }
      });


export default reduxForm({
  form: 'query'
})(
  connect(mapStateToProps, mapDispatchToProps)(QueryDBForm)
);
