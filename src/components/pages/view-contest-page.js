import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Row, Col, Button, Table, Modal, Input } from "react-materialize";
import { Link } from "react-router-dom";

import { getContest } from "../../actions";
import { RightButtonPanel, VerticalNav } from "../utilities";
import CreateContestForm from "../forms/create-contest";
import RequestTSForm from "../forms/request-test-solvers";
import CreateTestForm from "../forms/create-test";

class ContestPreviewDumb extends Component {
  contestTabs = {
    "tests": {
      title: () => "Tests",
      view: ({ data: { content } }) => {
        if (!content) return <div />;
        const contest = content;
        return (
          <div className="round-container">
            <Modal trigger={<Button className="teal darken-3" waves="light">Create</Button>}>
              <CreateTestForm contest_id={ contest._id } />
            </Modal>
            { (content.tests.length > 0) ? (
                <Table>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Target Number of Problems</th>
                      <th>Added Problems</th>
                    </tr>
                  </thead> 
                  <tbody>
                  {
                    content.tests.map((test, key) => (
                      <tr key={key}>
                        <td><Link to={ `/view-test/${test._id}` } className="teal-text text-darken-3 underline-hover">{test.name}</Link></td>
                        <td>{test.num_problems}</td>
                        <td>{test.problems.length}</td>
                      </tr>
                    ))
                  }
                  </tbody>
                </Table>
              ) : ( <p>No tests created yet.</p> )
            }
          </div>
        );
      }
    },
    "test-solvers": {
      title: () => "Test Solvers",
      view: ({ data: { content } }) => {
        if (!content) return <div />;
        return (
          <div className="round-container">
            <Modal trigger={<Button className="teal darken-3" waves="light">Request</Button>}><RequestTSForm contest_id={ content._id } /></Modal>
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
                  content.test_solvers.map((ts, key) => (
                    <tr key={key}>
                      <td>{ts.name}</td>
                      <td>{ts.email}</td>
                      <td className="center-align"><a className="black-text"><i className="fa fa-times" aria-hidden="true"></i></a></td>
                    </tr>
                  ))
                }
              </tbody>
            </Table>
          </div>
        );
      }
    }
  };

  render() {
    const { data } = this.props,
          contest = data.content;
    if (!contest) return <div />;

    const childProps = {
            "tests": { data },
            "czars": { data },
            "test-solvers": { data }
          };

    return (
      <Col s={12}>
        <h2 className="teal-text text-darken-3">{contest.name}</h2>
        <VerticalNav tabs={ this.contestTabs } childProps={ childProps } active="tests" />
      </Col>
    );
  }
}
const mapStateToProps = state => ({
  data: state.contests.contest
});

const ContestPreview = connect(mapStateToProps)(ContestPreviewDumb);

class ViewContestPage extends Component {
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
