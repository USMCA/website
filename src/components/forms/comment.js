import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";

import { KaTeXInput } from "./utilities";

class CommentForm extends React.Component {
  onSubmit = ({ comment }) => {
    console.log(comment);
  }

  commentField = ({ input, meta, ...rest }) => (
    <KaTeXInput
      type="textarea"
      label="Comment"
      includeSubmit={true}
      { ...input } { ...rest } />
  );

  render() {
    const { handleSubmit } = this.props;
    return (
      <form onSubmit={ handleSubmit(this.onSubmit) }>
        <div>
          <Field name="comment" component={ this.commentField } />
        </div>
      </form>
    );
  }
};

CommentForm.propTypes = {
  /* problem id to comment to */
  id: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired
};

export default reduxForm({ form: 'comment' })(CommentForm);
