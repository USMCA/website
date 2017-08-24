import React from "react";
import PropTypes from "prop-types";
import { Field, reduxForm } from "redux-form";
import { Input, Row, Button } from "react-materialize";

import Error from "../error";
import { RightButtonPanel } from "../utilities";
import { competitionsInputOptions, CompetitionsInput } from "./utilities";

const CompetitionInput = ({ input, meta, ...rest }) => (
        <CompetitionsInput type={ competitionsInputOptions.DIRECTOR } { ...input } { ...rest } />
      ),
      NameInput = ({ input, meta, ...rest }) => (
        <Input s={12} label="Name" { ...input } { ...rest } />
      ),
      DateInput = ({ input, meta, ...rest }) => (
        <Input s={12} label="Date" type="date" { ...input } { ...rest } />
      );

class CreateContestForm extends React.Component { 
  onSubmit = ({ competition_id, name, date }) => {
  }

  render() {
    const { handleSubmit } = this.props;
    return (
      <form onSubmit={ handleSubmit(this.onSubmit) }>
        <Row>
          <div>
            <Field name="competition_id" component={ CompetitionInput } />
          </div>
          <div>
            <Field name="name" component={ NameInput } />
          </div>
          <div>
            <Field name="date" component={ DateInput } />
          </div>
          <RightButtonPanel>
            <Button type="submit" className="teal darken-3">Create</Button>
          </RightButtonPanel>
          <Error error={ false } message="Ailee is way too hot." />
        </Row>
      </form>
    );
  }
}

export default reduxForm({
  form: 'create-contest'
})(CreateContestForm);
