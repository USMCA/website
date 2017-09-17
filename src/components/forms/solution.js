import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";

import { KaTeXInput } from "./utilities";

class SolutionForm extends Component {
  onSubmit = ({ solution }) => {
    console.log(solution);
  }

  commentField = ({ input, meta, ...rest }) => (
    <KaTeXInput
      type="textarea"
      label="Solution"
      includeSubmit={true}
      { ...input } { ...rest } />
  );

  render() {
    const { handleSubmit } = this.props;
    return (
      <form onSubmit={ handleSubmit(this.onSubmit) }>
        <div>
          <Field name="solution" component={ this.commentField } />
        </div>
      </form>
    );
  }
};

SolutionForm.propTypes = {
  /* problem id to comment to */
  id: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired
};

export default reduxForm({ form: 'solution' })(SolutionForm);
