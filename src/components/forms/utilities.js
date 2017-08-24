import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import _ from "lodash";

import { allCompetitions, directorCompetitions } from "../../actions";
import Autocomplete from "../react-materialize-custom/Autocomplete";

/*******************************************************************************
 * Autocomplete for competitions.
 ******************************************************************************/

const competitionsInputOptions = {
  ALL: "all",
  DIRECTOR: "director"
}

const competitionArrayToObject = a => {
  return _.reduce(a, (o, comp) => Object.assign(o, { [comp.name]: null }), {});
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
      <Autocomplete
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

export {
  competitionsInputOptions,
  CompetitionsInput
};
