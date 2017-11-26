import * as React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Field, reduxForm } from "redux-form";
import { Input, Row, Col, Button } from "react-materialize";

import Spinner from "../spinner";
import Error from "../error";
import { RightButtonPanel } from "../utilities";
import { postTest } from "../../actions";
import { requestStatuses } from "../../actions/types";

const { SUCCESS, PENDING, SUBMITTED, ERROR, IDLE } = requestStatuses;

const NameInput = ({ input, meta, ...rest }) => (
        <Input m={6} s={12} label="Name" { ...input } { ...rest } />
      ),
      NumberInput = ({ input, meta, ...rest }) => (
        <Input m={3} s={12} label="Test Size" type="number" min={0} { ...input } { ...rest } />
      );

class CreateTestForm extends React.Component { 
  onSubmit = ({ name, number }) => {
    const { contest_id, postTest } = this.props;
    postTest({ name, num_problems: number, contest_id });
  }

  render() {
    const { handleSubmit, postTestData: { requestStatus, message } } = this.props;
    return (requestStatus === SUCCESS) ? (
      <p>Test created!</p>
    ) : (
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
        <Error error={ requestStatus === ERROR } message={ message }/>
        { (requestStatus === PENDING) && <Spinner /> }
      </form>
    );
  }
}

CreateTestForm.propTypes = {
};

const mapStateToProps = state => ({
        postTestData: state.contests.postTestData
      }),
      mapDispatchToProps = dispatch => ({
        postTest: ({ name, num_problems, contest_id }) => {
          postTest({ name, num_problems, contest_id })(dispatch);
        }
      });

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    form: 'create-test'
  })(CreateTestForm)
);
