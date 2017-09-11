import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { Input, Row, Col, Button } from "react-materialize";

import Spinner from "../spinner";
import Error from "../error";
import { RightButtonPanel } from "../utilities";
import {
  competitionsInputOptions,
  CompetitionsInput,
  CompetitionsSelect,
  LocationArrayInput,
  UsersAutocompleteInput
} from "./utilities";
import {
  joinCompetition
} from "../../actions";
import { COMP_REQ_JOIN, requestStatuses } from "../../actions/types";

const { SUCCESS, PENDING, ERROR, SUBMITTED, IDLE } = requestStatuses;

class InviteUser extends React.Component {
  onSubmit = ({ user_id }) => {
    console.log(user_id);
  }

  userField = ({ input, meta, ...rest }) => (
    <UsersAutocompleteInput { ...input } { ...rest } l={9} s={12} limit={5} />
  )

  render() {
    const { handleSubmit } = this.props;
    return (
      <form onSubmit={ handleSubmit(this.onSubmit) }>
        <div>
          <Field name="user_id" component={ this.userField } />
        </div>
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
  data: PropTypes.object.isRequired,
  joinCompetition: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
        data: state.competitions.joinCompetition
      }),
      mapDispatchToProps = dispatch => ({
        joinCompetition: ({ competition_id }) => {
          joinCompetition(competition_id)(dispatch);
        },
        errorHandler: message => {
          dispatch({
            type: COMP_REQ_JOIN,
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
