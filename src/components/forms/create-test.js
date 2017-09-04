import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { Input, Row, Col, Button } from "react-materialize";

import Spinner from "../spinner";
import Error from "../error";
import { RightButtonPanel } from "../utilities";
import { CONTEST_POST, requestStatuses } from "../../actions/types";

const { SUCCESS, PENDING, SUBMITTED, ERROR, IDLE } = requestStatuses;

const NameInput = ({ input, meta, ...rest }) => (
        <Input m={6} s={12} label="Name" { ...input } { ...rest } />
      ),
      NumberInput = ({ input, meta, ...rest }) => (
        <Input m={3} s={12} label="Test Size" type="number" min={0} { ...input } { ...rest } />
      );

class CreateTestForm extends React.Component { 
  onSubmit = ({ name, number }) => {
    console.log(name, number);
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <form onSubmit={ handleSubmit(this.onSubmit) }>
        <Row>
          <div>
            <Field name="name" component={ NameInput } />
          </div>
          <div>
            <Field name="number" component={ NumberInput } />
          </div>
          <Col m={3} s={12}>
            <RightButtonPanel>
              <Button type="submit" className="teal darken-3">Create</Button>
            </RightButtonPanel><br />
          </Col>
        </Row>
      </form>
    );
  }
}

CreateTestForm.propTypes = {
};

const mapStateToProps = state => ({
      }),
      mapDispatchToProps = dispatch => ({
      });

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    form: 'create-test'
  })(CreateTestForm)
);
