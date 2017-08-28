import React from "react";
import { Row, Col, Button, Table, Modal, Input } from "react-materialize";

import { RightButtonPanel, VerticalNav } from "../utilities";
import CreateContestForm from "../forms/create-contest";

const contestTabs = ({ name, date, locations, status, tests, czars, testSolvers }) => ({
  "tests": {
    title: "Tests",
    view: (
      <div className="round-container">
        <Button className="teal darken-3">Add</Button>
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
                  <td><a href="/view-test" className="teal-text text-darken-3">Manage</a></td>
                </tr>
              ))
            }
          </tbody>
        </Table>
      </div>
    )
  },
  "czars": {
    title: "Czars",
    view: (
      <div className="round-container">
        <Button className="teal darken-3">Add</Button>
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
                  <td className="center-align"><a href="#" className="black-text"><i className="fa fa-times" aria-hidden="true"></i></a></td>
                </tr>
              ))
            }
          </tbody>
        </Table><br />
        <RightButtonPanel>
          <a href="#" className="btn teal darken-3">Leave as czar</a>
        </RightButtonPanel>
      </div>
    )
  },
  "test-solvers": {
    title: "Test Solvers",
    view: (
      <div className="round-container">
        <Button className="teal darken-3">Add</Button> <Button className="teal darken-3">Request</Button>
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
                  <td className="center-align"><a href="#" className="black-text"><i className="fa fa-times" aria-hidden="true"></i></a></td>
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
]

const ContestPreview = ({ name, date, locations, status, tests, czars, testSolvers }) => (
  <Col s={12}>
    <h2 className="teal-text text-darken-3">{name}</h2>
    <VerticalNav tabs={ contestTabs({ name, date, locations, status, tests, czars, testSolvers })} active="tests" />
  </Col>
)

const ViewContestPage = () => (
  <Row className="container">
    <ContestPreview name="CMIMC 2018" date="January 28th, 2018" locations={["Carnegie Mellon University", "CMU Qatar Campus"]} status="Active" tests={tests} czars={["Taisuke Yasuda", "Cody Johnson"]} testSolvers={["Taisuke Yasuda", "Cody Johnson"]} />
  </Row>
);

export default ViewContestPage;
