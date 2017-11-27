import * as React from "react";
import { Row, Col, Input } from "react-materialize";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import { ProblemPreview } from "../utilities";
import { fetchDatabase } from "../../actions";
import QueryDBForm from "../forms/query-db";

const mapStateToProps = state => ({
  database: state.problems.database
});
const mapDispatchToProps = dispatch => ({
  fetchDatabase: id => {
    fetchDatabase(id)(dispatch);
  }
});

const TitleDumb = ({ database }) => {
  if (!database.content || !database.content.problems) return <div />;
  const { competition } = database.content;

  return (
    <h2 className="teal-text text-darken-4">{ competition.short_name } Database</h2>
  );
}
const Title = connect(mapStateToProps)(TitleDumb);

const ResultsDumb = ({ database }) => {
  if (!database.content || !database.content.problems) return <div />;
  const { problems } = database.content;
  return (
    <Col s={12}>
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
  );
}
const Results= connect(mapStateToProps)(ResultsDumb);

class DatabasePage extends React.Component {
  componentWillMount() {
    const { match, fetchDatabase } = this.props;
    fetchDatabase(match.params.id);
  }

  render() {
    const { match } = this.props;
    return (
      <Row className="container">
        <Col s={12}>
          <Title />
          <QueryDBForm competition_id={ match.params.id } />
          <Results />
        </Col>
      </Row>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DatabasePage);
