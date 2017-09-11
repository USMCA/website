import React from "react";
import PropTypes from "prop-types";
import { Col, Button } from "react-materialize";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import _ from "lodash";

import Input from "../react-materialize-custom/ControlledInput";
import { RightButtonPanel } from "../utilities";
import { permissionsEnum } from "../../../constants";

class PermissionsForm extends React.Component {
  onSubmit = ({ permission }) => {
    console.log(permission);
  }

  permissionField  = ({ input, meta, ...rest }) => {
    console.log(this.props.defaultValue);
    console.log(Object.keys(permissionsEnum));
    return (
      <Input s={12} type="select" defaultValue={ this.props.defaultValue } { ...input } { ...rest }>
        <option value="">Select a Permission</option>
        {
          _.keys(permissionsEnum).map((key, idx) => (
            <option value={ key } key={ idx }>{ permissionsEnum[key] }</option>
          ))
        }
      </Input>
    );
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <form onSubmit={ handleSubmit(this.onSubmit) }>
        <div>
          <Field name="permission" component={ this.permissionField } />
        </div>
        <RightButtonPanel>
          <Button type="submit">Apply</Button>
        </RightButtonPanel>
      </form>
    );
  }
}

export default reduxForm({ form: 'change-permission' })(PermissionsForm);
