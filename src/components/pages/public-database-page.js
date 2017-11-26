import * as React from "react";
import { Row, Col, Input } from "react-materialize";
import { connect } from "react-redux";

import { ProblemPreview } from "../utilities";
import { publicDatabase } from "../../actions";

class DatabasePage extends React.Component {
  componentWillMount() {
    const { publicDatabase } = this.props;
    publicDatabase();
  }

  render() {
    const { database } = this.props;
    return (
      <Row className="container">
        <Col s={12}>
          <h2 className="teal-text text-darken-4">Public Database</h2>
          <Row>
            <form className="col s12">
              <Row>
                <Input m={4} s={12} type="select" label="Subject" multiple>
                    <option value="">Choose your option</option>
                    <option value="1">Option 1</option>
                    <option value="2">Option 2</option>
                    <option value="3">Option 3</option>
                </Input>
                <Input m={4} s={12} type="select" label="Sort by" multiple>
                    <option value="">Choose your option</option>
                    <option value="1">Option 1</option>
                    <option value="2">Option 2</option>
                    <option value="3">Option 3</option>
                </Input>
                <Input m={4} s={12} type="select" label="Difficulty" multiple>
                    <option value="">Choose your option</option>
                    <option value="1">Easy</option>
                    <option value="2">Medium</option>
                    <option value="3">Hard</option>
                </Input>
              </Row>
            </form>
          </Row>
          {
            (database.content) && (
              (database.content.length > 0) ? (
                <div>
                  <h3>Results</h3>
                  {
                    (database.content.map((proposal, key) => (
                      <div style={{borderBottom: "1px solid #cfd8dc", paddingTop: "12px"}} key={key}>
                        <ProblemPreview problem={proposal} publicDatabase={ true } />
                      </div>)
                    ))
                  }
                </div>
              ) : ( <p>No problems in the public database.</p> )
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
  database: state.problems.publicDatabase
});
const mapDispatchToProps = dispatch => ({
  publicDatabase: id => {
    publicDatabase(id)(dispatch);
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(DatabasePage);
