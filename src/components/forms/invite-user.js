import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { Input, Row, Col, Button } from "react-materialize";

import Spinner from "../spinner";
import Error from "../error";
import { RightButtonPanel } from "../utilities";
import { UsersAutocompleteInput } from "./utilities";
import { inviteUser } from "../../actions";
import { COMP_INV_JOIN, requestStatuses } from "../../actions/types";

const { SUCCESS, PENDING, ERROR, SUBMITTED, IDLE } = requestStatuses;

class InviteUser extends React.Component {
  onSubmit = ({ user_id }) => {
    const { inviteUser, errorHandler, competition_id } = this.props;
    if (!user_id) errorHandler("User not specified.");
    else inviteUser({ competition_id, user_id });
  }

  userField = ({ input, meta, ...rest }) => (
    <UsersAutocompleteInput { ...input } { ...rest } l={9} s={12} limit={5} />
  )

  render() {
    const {
      handleSubmit,
      inviteData: { requestStatus, message, content },
      resetForm
    } = this.props;
    return requestStatus === SUCCESS ? (
      <p>Invite sent to user. Click <a onClick={ resetForm }>here</a> to add another user.</p>
    ) : (
      <form onSubmit={ handleSubmit(this.onSubmit) }>
        <div>
          <Field name="user_id" component={ this.userField } />
        </div>
        <Error error={ requestStatus === ERROR } message={ message } />
        <Col l={3} s={12}>
          <RightButtonPanel>
            <Button waves="light" className="teal darken-2" type="submit">
              Invite
            </Button>
          </RightButtonPanel>
        </Col>
      </form>
    );  
  }
}

InviteUser.propTypes = {
  competition_id: PropTypes.string.isRequired,
  inviteData: PropTypes.object.isRequired,
  inviteUser: PropTypes.func.isRequired,
  errorHandler: PropTypes.func.isRequired,
  resetForm: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
        inviteData: state.competitions.inviteCompetition
      }),
      mapDispatchToProps = dispatch => ({
        inviteUser: ({ competition_id, user_id }) => {
          inviteUser({ competition_id, user_id })(dispatch);
        },
        resetForm: () => {
          dispatch({ type: COMP_INV_JOIN, payload: { requestStatus: IDLE } });
        },
        errorHandler: message => {
          dispatch({
            type: COMP_INV_JOIN,
            payload: {
              requestStatus: ERROR,
              message
            }
          });
        }
      });

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    form: 'invite-user'
  })(InviteUser)
);
