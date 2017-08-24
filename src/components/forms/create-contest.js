import React from "react";
import PropTypes from "prop-types";
import { Field, reduxForm } from "redux-form";
import { Input, Row, Button } from "react-materialize";

import { RightButtonPanel } from "../utilities";
import { competitionsInputOptions, CompetitionsInput } from "./utilities";

class CreateContestForm extends React.Component { 
  render() {
    return (
      <form>
        <Row>
          <CompetitionsInput type={ competitionsInputOptions.DIRECTOR } />
          <Input s={12} label="Name" />
          <Input s={12} label="Date" />
          <RightButtonPanel>
            <Button className="teal darken-3">Create</Button>
          </RightButtonPanel>
        </Row>
      </form>
    );
  }
}

export default CreateContestForm;
