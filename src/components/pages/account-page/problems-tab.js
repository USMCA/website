import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Col } from "react-materialize";

import { probErrorHandler, fetchMyProposals } from "../../../actions";
import { ProblemPreview, LoadMore } from "../../utilities";

class ProblemsTab extends React.Component {
  componentWillMount = () => {
    this.props.fetchMyProposals();
  }

  render() {
    const { proposals } = this.props;
    return (proposals.length > 0) ? (
      <Col s={12}>
        {
          proposals.map((proposal, key) => (
            <ProblemPreview problem={proposal} key={key} />
          ))
        }
        <LoadMore />
      </Col>
    ) : (
      <div>
        <p>No proposals made yet! Click <Link to="/propose">here</Link> to make problem proposals.</p>
      </div>
    );
  }
}

ProblemsTab.propTypes = {
  proposals: PropTypes.array.isRequired,
  probErrorHandler: PropTypes.func.isRequired,
  fetchMyProposals: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
        probError: state.problems.error,
        probMessage: state.problems.message,
        proposals: state.problems.myProposals
      }),
      mapDispatchToProps = dispatch => ({
        probErrorHandler: errorMessage => {
          probErrorHandler(dispatch, errorMessage);
        },
        fetchMyProposals: () => {
          fetchMyProposals()(dispatch);
        }
      });

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProblemsTab);
