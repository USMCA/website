import React, { Component } from "react";
import PropTypes from "prop-types";
import { Row, Col, Modal, Button } from "react-materialize";
import { ProblemPreview, LoadMore } from "../utilities";
import { connect } from "react-redux";
import moment from "moment";

import { userTS, getTest, joinTestSolve } from "../../actions";

class TestSolvePage extends Component {
  componentWillMount() {
    this.props.userTS();
  }

  generalTS = general => {
    const { joinTestSolve } = this.props;
    if (!general) return <div />;
    if (general.length === 0) 
      return <li className="transparent">No test solve requests found.</li>;
    return general.map((contest, idx) => (
      <li key={idx}>
        <a><span className="select-circle"></span></a>
        <span className="bold-text">{ contest.name }</span> requests <span className="bold-text">{ contest.requested_test_solvers }</span> test solvers. Their deadline is <span className="bold-text">{ moment(contest.test_solve_deadline).format('ll') }</span>.  
        <Modal 
          header="Confirm Application" 
          trigger={<a className="underline-hover">Apply</a>} 
          actions={
            <div>
              <Button flat modal="close" waves="light">Cancel</Button>
              <Button flat modal="close" waves="light"
                onClick={ () => joinTestSolve(contest._id) }>Confirm</Button>
            </div>
          }>
          Are you sure you want to apply to be a test solver for { contest.name }?
        </Modal>
      </li>
    ))
  }

  userTS = user => {
    const { getTest } = this.props;
    if (!user) return <div />;
    if (user.length === 0) 
      return <li className="transparent">No test solve contests found.</li>;
    return user.map((contest, idx) => (
      <li key={idx}><span className="bold-text">{ contest.name }</span> (deadline: <span className="bold-text">{ moment(contest.test_solve_deadline).format('ll') }</span>)
        <ul>
          { contest.tests.length > 0 ? contest.tests.map((test, idx) => (
              <li key={idx}><a className="underline-hover teal-text text-darken-3" onClick={ () => { console.log(test._id); getTest(test._id); } }>{ test.name }</a></li>
            )) : ( <p>No tests created yet.</p> ) 
          }
        </ul>
      </li>
    ));
  }

  viewTest = test => (
    <div>
      <h2>{ test.contest.name }</h2>
      <h3>{ test.name }</h3>
      {
        test.problems.length > 0 ? (
          test.problems.map((problem, idx) => (
            <div key={idx}>
              <ProblemPreview problem={ problem } />
            </div>
          ))
        ) : ( <p>No problems proposed yet.</p> )
      }
    </div>
  )

  render() {
    const { 
      testSolveData: { content }, 
      testData: { content: test } 
    } = this.props;
    if (!content) return <div />;
    return (
      <Row className="container">
        <Col m={7} s={12} style={{marginTop: "24px"}}>
          {
            test ? this.viewTest(test) : 
            <p>Select a test from the <span className="bold-text">Contests</span> section on the right.</p>
          }
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
  testSolveData: state.users.test_solve,
  testData: state.contests.test
});
const mapDispatchToProps = dispatch => ({
  userTS: () => { userTS()(dispatch); },
  getTest: id => { getTest(id)(dispatch); },
  joinTestSolve: id => { joinTestSolve(id)(dispatch); }
});

export default connect(mapStateToProps, mapDispatchToProps)(TestSolvePage);
