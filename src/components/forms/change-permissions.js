import React, { Component } from "react";
import PropTypes from "prop-types";
import { Col, Button } from "react-materialize";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import _ from "lodash";

import Input from "../react-materialize-custom/ControlledInput";
import { RightButtonPanel } from "../utilities";
import { permissionsEnum } from "../../../constants";
import { changePermissions } from "../../actions";
import { 
  USER_CHANGE_PERM, 
  requestStatuses, 
  requestPayloads
} from "../../actions/types";

const { SUCCESS, IDLE, PENDING, ERROR } = requestStatuses;

class ChangePermissions extends Component {
  onSubmit = ({ permission }) => {
    const { competition_id, user_id, changePermissions } = this.props;
    console.log(competition_id, user_id, permission);
    changePermissions({ competition_id, user_id, permission });
  }

  permissionField  = ({ input, meta, ...rest }) => {
    return (
      <div>
        <p>Current status: <span className="bold-text">{ permissionsEnum[this.props.defaultValue] }</span></p>
        <Input s={12} type="select" defaultValue={ this.props.defaultValue } { ...input } { ...rest }>
          <option value="">Select a Permission</option>
          {
            _.keys(permissionsEnum).map((key, idx) => (
              <option value={ key } key={ idx }>{ permissionsEnum[key] }</option>
            ))
          }
        </Input>
      </div>
    );
  }

  render() {
    const { 
      handleSubmit,
      changePermData: { requestStatus, message, content }, // content is user_id
      user_id,
      resetForm
    } = this.props;
    return (content === user_id && requestStatus === SUCCESS) ? (
      <p>Changed permission! Click <a onClick={ resetForm }>here</a> to change the permission again.</p>
    ) :(
      <form onSubmit={ handleSubmit(this.onSubmit) }>
        <div>
          <Field name="permission" component={ this.permissionField } />
        </div>
        <RightButtonPanel>
          <Button type="submit" className="teal darken-2">Apply</Button>
        </RightButtonPanel>
      </form>
    );
  }
}

const mapStateToProps = state => ({
        changePermData: state.users.changePermission
      }),
      mapDispatchToProps = dispatch => ({
        changePermissions: ({ competition_id, user_id, permission }) => {
          changePermissions({ competition_id, user_id, permission })(dispatch);
        },
        resetForm: () => {
          dispatch(Object.assign(
            { type: USER_CHANGE_PERM }, 
            requestPayloads.idlePayload()
          ));
        }
      });

export default connect(
  mapStateToProps, mapDispatchToProps
)(
  reduxForm({ form: 'change-permissions' })(ChangePermissions)
);
