import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Row, Col, Button, Table, Modal, Input } from "react-materialize";
import { Link } from "react-router-dom";

import { getContest } from "../../actions";
import { RightButtonPanel, VerticalNav } from "../utilities";
import CreateContestForm from "../forms/create-contest";
import RequestTSForm from "../forms/request-test-solvers";
import CreateTestForm from "../forms/create-test";

const contestTabs = ({ name, date, locations, tests, czars, testSolvers }) => ({
  "tests": {
    title: () => "Tests",
    view: () => (
      <div className="round-container">
        <Modal trigger={<Button className="teal darken-3" waves="light">Add</Button>}><CreateTestForm /></Modal>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Problems</th>
              <th>Options</th>
            </tr>
          </thead> 
          <tbody>
            {
              tests.map((test, key) => (
                <tr key={key}>
                  <td>{test.name}</td>
                  <td>{test.problems}</td>
                  <td><Link to={ `/view-test/${test._id}` } className="teal-text text-darken-3 underline-hover">Manage</Link></td>
                </tr>
              ))
            }
          </tbody>
        </Table>
      </div>
    )
  },
  "czars": {
    title: () => "Czars",
    view: () => (
      <div className="round-container">
        <Button className="teal darken-3" waves="light">Invite</Button>
        <h3>Czars</h3>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th className="center-align">Remove</th>
            </tr>
          </thead>

          <tbody>
            {
              czars.map((czar, key) => (
                <tr key={key}>
                  <td>{czar}</td>
                  <td>ctj@math.cmu.edu</td>
                  <td className="center-align"><a className="black-text"><i className="fa fa-times" aria-hidden="true" /></a></td>
                </tr>
              ))
            }
          </tbody>
        </Table><br />
        <RightButtonPanel>
          <a className="btn teal darken-3 waves-effect waves-light">Leave as czar</a>
        </RightButtonPanel>
      </div>
    )
 },
  "test-solvers": {
    title: () => "Test Solvers",
    view: () => (
      <div className="round-container">
        <Button className="teal darken-3" waves="light">Invite</Button> <Modal trigger={<Button className="teal darken-3" waves="light">Request</Button>}><RequestTSForm /></Modal>
        <h3>Test Solvers</h3>
        <Table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th className="center-align">Remove</th>
            </tr>
          </thead>

          <tbody>
            {
              testSolvers.map((czar, key) => (
                <tr key={key}>
                  <td>{czar}</td>
                  <td>ctj@math.cmu.edu</td>
                  <td className="center-align"><a className="black-text"><i className="fa fa-times" aria-hidden="true"></i></a></td>
                </tr>
              ))
            }
          </tbody>
        </Table>
      </div>
    )
  }
});

const tests = [
  {name: "Algebra (Individuals)", problems: 10},
  {name: "Combinatorics (Individuals)", problems: 10},
  {name: "Computer Science (Individuals)", problems: 10},
  {name: "Geometry (Individuals)", problems: 10},
  {name: "Number Theory (Individuals)", problems: 10},
  {name: "Team", problems: 10},
  {name: "Algebra (Individuals)", problems: 1}
], date="January 28, 2018", czars = ["Tai", "Ailee"], 
  testSolvers=["Ailee"], locations=["asdf"], name="CMIMC Ailee";

class ContestPreviewDumb extends React.Component {

  render() {
    console.log(this.props.data);
    return (
      <Col s={12}>
        <h2 className="teal-text text-darken-3">{name}</h2>
        <VerticalNav tabs={ contestTabs({ name, date, locations, tests, czars, testSolvers })} active="tests" />
      </Col>
    );
  }
}
const mapStateToProps = state => ({
  data: state.contests.contest
});

const ContestPreview = connect(mapStateToProps)(ContestPreviewDumb);

class ViewContestPage extends React.Component {
  componentWillMount() {
    const { match, getContest } = this.props;
    getContest(match.params.id);
  }
  
  render() {
    return (
      <Row className="container">
        <ContestPreview />
      </Row>
    );
  }
}
const mapDispatchToProps = dispatch => ({
  getContest: id => { getContest(id)(dispatch); }
});

export default connect(null, mapDispatchToProps)(ViewContestPage);
