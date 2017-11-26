import * as React from "react";
import { Row, Col, Input, Button } from "react-materialize";
import { getProposal } from "../../actions";
import { connect } from "react-redux";

import ProposeForm from "../forms/propose";

class ProposePage extends React.Component {
  componentWillMount() {
    const { match, getProposal } = this.props;
    if (match.params && match.params.id) getProposal(match.params.id);
  }

  render() {
    const { match, proposal } = this.props,
          edit = !!(match.params && match.params.id),
          initialized = edit && proposal;
    return (
      <Row className="container">
        <h2 className="teal-text text-darken-4">
          { edit ? "Edit a Problem" : "Propose a Problem" }
        </h2>
        <ProposeForm
          edit={ edit }
          proposal={ initialized ? proposal.content : null }/>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
        proposal: state.problems.proposal
      }),
      mapDispatchToProps = dispatch => ({
        getProposal: id => {
          getProposal(id)(dispatch);
        }
      });

export default connect(mapStateToProps, mapDispatchToProps)(ProposePage);
