import React from "react";
import PropTypes from "prop-types";
import { Row, Col } from "react-materialize";
import { ProblemPreview, LoadMore } from "../utilities";
import { connect } from "react-redux";
import moment from "moment";

import { userTS } from "../../actions";

class TestSolvePage extends React.Component {
  componentWillMount() {
    this.props.userTS();
  }

  generalTS = general => {
    if (!general) return <div />;
    if (general.length === 0) 
      return <li className="transparent">No test solve requests found.</li>;
    return general.map((contest, idx) => (
      <li key={idx}>
        <a><span className="select-circle"></span></a>
        <span className="bold-text">{ contest.name }</span> requests <span className="bold-text">{ contest.requested_test_solvers }</span> test solvers. Their deadline is <span className="bold-text">{ moment(contest.test_solve_deadline).format('ll') }</span>. <a className="underline-hover">Apply</a>
      </li>
    ))
  }

  userTS = user => {
    if (!user) return <div />;
    if (user.length === 0) 
      return <li className="transparent">No test solve contests found.</li>;
    return user.map((contest, idx) => (
      <li key={idx}><span className="bold-text">{ contest.name }</span> (deadline: <span className="bold-text">{ moment(contest.test_solve_deadline).format('ll') }</span>)
        <ul>
          { contest.tests.length > 0 ? contest.tests.map((test, idx) => (
              <li><a className="underline-hover teal-text text-darken-3">{ test.name }</a></li>
            )) : ( <p>No tests created yet.</p> ) 
          }
        </ul>
      </li>
    ));
  }

  render() {
    const { testSolveData: { content } } = this.props;
    console.log(content);
    if (!content) return <div />;
    return (
      <Row className="container">
        <Col m={7} s={12} style={{marginTop: "24px"}}>
          <p>Select a test from the <span className="bold-text">Contests</span> section on the right.</p>
        </Col>
        <Col m={5} s={12} style={{marginTop: "20px"}}>
          <h3>Requests</h3>
          <div className="notifications-container">
            <ul className="notifications-list">
              { this.generalTS(content.general) }
              <li className="transparent center-align"><LoadMore /></li>
            </ul>
          </div>
          <h3>Contests</h3>
          <ul className="contests-list">
            { this.userTS(content.user) }
          </ul>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  testSolveData: state.users.test_solve
});
const mapDispatchToProps = dispatch => ({
  userTS: () => { userTS()(dispatch); }
});

export default connect(mapStateToProps, mapDispatchToProps)(TestSolvePage);
