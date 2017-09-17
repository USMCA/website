import * as React from "react";
import { Row, Col, Input } from "react-materialize";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { ProblemPreview } from "../utilities";
import { fetchDatabase } from "../../actions";

class DatabasePage extends React.Component {
  componentWillMount() {
    const { match, fetchDatabase } = this.props;
    fetchDatabase(match.params.id);
  }

  render() {
    const { database } = this.props;
    if (!database.content || !database.content.problems) return <div />;
    const { problems, competition } = database.content;
    return (
      <Row className="container">
        <Col s={12}>
          <h2 className="teal-text text-darken-4">{ competition.short_name } Database</h2>
          <Row>
            <form className="col s12">
              <Row>
                <Input l={3} m={6} s={12} type="select" label="Contest" multiple>
                    <option value="" disabled>Choose your option</option>
                    <option value="1">Option 1</option>
                    <option value="2">Option 2</option>
                    <option value="3">Option 3</option>
                </Input>
                <Input l={3} m={6} s={12} type="select" label="Subject" multiple>
                    <option value="">Choose your option</option>
                    <option value="1">Option 1</option>
                    <option value="2">Option 2</option>
                    <option value="3">Option 3</option>
                </Input>
                <Input l={3} m={6} s={12} type="select" label="Sort by" multiple>
                    <option value="">Choose your option</option>
                    <option value="1">Option 1</option>
                    <option value="2">Option 2</option>
                    <option value="3">Option 3</option>
                </Input>
                <Input l={3} m={6} s={12} type="select" label="Difficulty" multiple>
                    <option value="">Choose your option</option>
                    <option value="1">Easy</option>
                    <option value="2">Medium</option>
                    <option value="3">Hard</option>
                </Input>
                <Col s={12}>
                  <ul className="inline-list">
                    <li>
                      <Input type="checkbox" label="original problems" defaultChecked="checked" />
                    </li>
                    <li>
                      <Input type="checkbox" label="borrowed problems" />
                    </li>
                  </ul>
                </Col>
              </Row>
            </form>
          </Row>
          <h3>Results</h3>
          {
            problems.map((proposal, key) => (
              <div style={{borderBottom: "1px solid #cfd8dc", paddingTop: "12px"}} key={key}>
                <ProblemPreview problem={proposal} includeClipboard={true}/>
              </div>)
            )
          }
          <div style={{padding: "24px 0"}}>
            <a className="load-more teal-text text-darken-3 underline-hover">Load more...</a>
          </div>
        </Col>
      </Row>
    );
  }
}

const mapStateToProps = state => ({
  database: state.problems.database
});
const mapDispatchToProps = dispatch => ({
  fetchDatabase: id => {
    fetchDatabase(id)(dispatch);
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(DatabasePage);
