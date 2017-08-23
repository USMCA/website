import React from "react";
import { Row, Col, Button, Table, Modal, Input } from "react-materialize";
import { RightButtonPanel, VerticalNav } from "../utilities";

const contestTabs = ({ name, date, locations, status, tests, czars, testSolvers }) => ({
  "info": {
    title: "Information",
    view: (
      <div className="round-container">
        <ul>
          <li>Name: {name}</li>
          <li>Date: {date}</li>
          <li>Location(s): {locations.join(", ")}</li>
          <li>Status: {status} (<a href="#" className="teal-text text-darken-3">{ (status === "Active") ? "Mark as inactive" : "Mark as active" }</a>)</li>
          <li><a href="/view-database" className="teal-text text-darken-3">View database</a></li>
        </ul>
      </div>
    )
  },
  "tests": {
    title: "Tests",
    view: (
      <div className="round-container">
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
        <ul>
          {
            czars.map((czar, key) => (
              <li key={key}>{czar}<a href="#" className="teal-text text-darken-3 right"><i className="fa fa-times" aria-hidden="true"></i></a></li>
            ))
          }
        </ul>
        <RightButtonPanel>
          <a href="#" className="teal-text text-darken-3">Add czars</a> <a href="#" className="teal-text text-darken-3">Leave as czar</a>
        </RightButtonPanel>
      </div>
    )
  },
  "test-solvers": {
    title: "Test Solvers",
    view: (
      <div className="round-container">
        <ul>
          {
            testSolvers.map((testSolver, key) => (
              <li key={key}>{testSolver}<a href="#" className="teal-text text-darken-3 right"><i className="fa fa-times" aria-hidden="true"></i></a></li>
            ))
          }
        </ul>
        <RightButtonPanel>
          <a href="#" className="teal-text text-darken-3">Add test solvers</a>
        </RightButtonPanel>
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
  <Col s={12} className="top-border">
    <h2 className="teal-text text-darken-3">{name}</h2>
    <VerticalNav tabs={ contestTabs({ name, date, locations, status, tests, czars, testSolvers })} active="info" />
  </Col>
)

const ContestsPage = () => (
  <Row className="container">
    <h2 className="teal-text text-darken-4">Contests</h2>
    <RightButtonPanel marginBottom="24px">
      <a href="/view-database" className="btn teal darken-3">Shared Database</a>
      <Modal header="Create New Contest" trigger={<Button className="teal darken-3">New Contest</Button>}>
        <form>
          <Row>
            <Input s={12} label="Competition" />
            <Input s={12} label="Name" />
            <Input s={12} label="Date" />
            <RightButtonPanel>
              <Button className="teal darken-3">Create</Button>
            </RightButtonPanel>
          </Row>
        </form>
      </Modal>
    </RightButtonPanel>
    <ContestPreview name="CMIMC 2018" date="January 28th, 2018" locations={["Carnegie Mellon University", "CMU Qatar Campus"]} status="Active" tests={tests} czars={["Taisuke Yasuda", "Cody Johnson"]} testSolvers={["Taisuke Yasuda", "Cody Johnson"]} />
  </Row>
);

export default ContestsPage;
