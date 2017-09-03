import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";

import { probComment } from "../../actions";
import { PROB_PROB_COMMENT, requestStatuses } from "../../actions/types";
import { KaTeXInput } from "./utilities";

const { SUBMIT, PENDING, SUBMITTED, IDLE, ERROR } = requestStatuses;

class CommentForm extends React.Component {
  onSubmit = ({ body }) => {
    const { problem_id, probComment, errorHandler, afterSubmit } = this.props;
    if (!body) return errorHandler("Empty comment submitted.");
    probComment(problem_id, body);
    if (afterSubmit) afterSubmit();
  }
  
  commentField = ({ input, meta, ...rest }) => (
    <KaTeXInput 
      type="textarea" 
      label="Comment" 
      includeSubmit={true}
      { ...input } { ...rest } />
  );

  render() { 
    const { handleSubmit, probData: { requestStatus, message } } = this.props;
    return (
      <form onSubmit={ handleSubmit(this.onSubmit) }>
        <div style={{marginTop: "12px"}}>
          <Field name="body" component={ this.commentField } />
        </div>
      </form>
    );
  }
}

CommentForm.propTypes = {
  problem_id: PropTypes.string.isRequired,
  probData: PropTypes.object.isRequired,
  probComment: PropTypes.func.isRequired,
  errorHandler: PropTypes.func.isRequired,
  afterSubmit: PropTypes.func,
  handleSubmit: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  probData: state.problems.proposal
});
const mapDispatchToProps = dispatch => ({
  probComment: (problem_id, body) => {
    probComment(problem_id, body)(dispatch);
  },
  errorHandler: message => {
    dispatch({ 
      type: PROB_PROB_COMMENT, 
      payload: { requestStatus: ERROR, message }
    });
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({ form: 'comment' })(CommentForm)
);
