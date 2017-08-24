import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import _ from "lodash";

import { allCompetitions } from "../../actions";
import Autocomplete from "../react-materialize-custom/Autocomplete";


const competitionArrayToObject = a => {
  return _.reduce(a, (o, comp) => Object.assign(o, { [comp.name]: null }), {});
};

class CompetitionsInputDumb extends React.Component {
  componentWillMount() {
    this.props.allCompetitions(); 
  }

  render() {
    const { input, meta, competitions, allCompetitions, ...rest } = this.props;
    console.log(competitionArrayToObject(competitions));
    return (
      <Autocomplete
        s={12} title="Competition" { ...input } { ...rest } 
        data={ competitionArrayToObject(competitions) } limit={5} />
    );
  }
};
const mapStateToProps = state => ({
        competitions: state.competitions.allCompetitions
      }),
      mapDispatchToProps = dispatch => ({
        allCompetitions: () => {
          allCompetitions()(dispatch)
        }
      });
const CompetitionsInput = connect(
  mapStateToProps, mapDispatchToProps
)(CompetitionsInputDumb);

export {
  CompetitionsInput
};
