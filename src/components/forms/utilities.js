import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Input, Row, Col } from "react-materialize";
import _ from "lodash";

import { allCompetitions, directorCompetitions } from "../../actions";
import AutocompleteSelect from "../react-materialize-custom/AutocompleteSelect";
import ControlledInput from "../react-materialize-custom/ControlledInput";

/*******************************************************************************
 * Autocomplete for competitions.
 ******************************************************************************/

const competitionsInputOptions = {
  ALL: "all",
  DIRECTOR: "director"
}

const competitionArrayToObject = a => {
  return _.reduce(a, (o, comp) => Object.assign(o, { [comp.name]: comp._id }), {});
};

class CompetitionsInputDumb extends React.Component {
  componentWillMount() {
    switch (this.props.type) {
      case (competitionsInputOptions.ALL):
        this.props.allCompetitions(); 
        break;
      case (competitionsInputOptions.DIRECTOR):
        this.props.directorCompetitions(); 
        break;
      default:
        this.props.allCompetitions();
    }
  }

  render() {
    const { 
      competitions, 
      allCompetitions,
      directorCompetitions,
      type,
      input, 
      meta,
      ...rest 
    } = this.props;
    return (
      <AutocompleteSelect
        s={12} title="Competition" { ...input } { ...rest } 
        data={ competitionArrayToObject(competitions[type]) } limit={5} />
    );
  }
};
CompetitionsInputDumb.propTypes = {
  competitions: PropTypes.object.isRequired,
  allCompetitions: PropTypes.func.isRequired,
  directorCompetitions: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired
};
const mapStateToProps = state => ({
        competitions: {
          [competitionsInputOptions.ALL]: state.competitions.allCompetitions,
          [competitionsInputOptions.DIRECTOR]: state.competitions.directorCompetitions
        }
      }),
      mapDispatchToProps = dispatch => ({
        allCompetitions: () => {
          allCompetitions()(dispatch);
        },
        directorCompetitions: () => {
          directorCompetitions()(dispatch);
        }
      });
const CompetitionsInput = connect(
  mapStateToProps, mapDispatchToProps
)(CompetitionsInputDumb);

/*******************************************************************************
 * Array of locations input for contests.
 ******************************************************************************/

class LocationArrayInput extends React.Component {
  constructor() {
    super();

    this.state = {
      site: '',
      address: '',
      value: []
    };
  }

  renderList = () => {
    return this.state.value.map((loc, idx) => (
      <Row key={idx}>
        <Col s={5}>{ loc.site }</Col>
        <Col s={6}>{ loc.address }</Col>
        <Col s={1}>
          <h1>
            <a onClick={ this.handleRemoveClick(idx) }>
              <i className="fa fa-times" aria-hidden="true"></i>
            </a>
          </h1>
        </Col>
      </Row>
    ));
  }

  handleAddClick = () => {
    if (!this.state.site) return;
    this.state.value.push({ 
      site: this.state.site, 
      address: this.state.address
    }); 
    this.state.site = "";
    this.siteInput._onChange({
      target: { value: "" }
    }, "");
    this.state.address = "";
    this.addressInput._onChange({
      target: { value: "" }
    }, "");
    this.forceUpdate();
  }

  handleRemoveClick = locIdx => (
    () => {
      _.remove(this.state.value, (val, idx) => (idx === locIdx));
      this.forceUpdate();
    }
  )

  render() {
    const siteLabel = "Site Name (required)",
          addressLabel = "Address";
    return (
      <div>
        {
          this.renderList()
        }
        <ControlledInput 
          type="text" 
          label={siteLabel} 
          s={5}
          ref={ elem => { this.siteInput = elem; } }
          onChange={(evt, val) => { this.state.site = evt.target.value; } } />
        <ControlledInput 
          type="text" 
          label={addressLabel} 
          s={6}
          ref={ elem => { this.addressInput = elem; } }
          onChange={(evt, val)=> { this.state.address = evt.target.value; } } />
        <Col s={1}>
          <h1>
            <a onClick={ this.handleAddClick }>
              <i className="fa fa-plus" aria-hidden="true"></i>
            </a>
          </h1>
        </Col>
      </div>
    );
  }
}

export {
  competitionsInputOptions,
  CompetitionsInput,
  LocationArrayInput
};
