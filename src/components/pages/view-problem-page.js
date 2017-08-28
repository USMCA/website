import React from "react";
import { Row, Col, Button, Collapsible, CollapsibleItem, Input } from "react-materialize";
import { connect } from "react-redux";

import renderKaTeX from "../../katex";
import { probErrorHandler, getProposal } from "../../actions";
import { HorizontalNav, Counter } from "../utilities";
import Spinner from "../spinner";

const Feedback = ({feedbackType, author, message}) => (
  <li>
    <Row className="feedback">
      <Col s={1}>
        <Vote type="novote" netVotes="4" />
      </Col>
      <Col s={8} className="katex-preview">
        <p>{message}</p>
      </Col>
      <Col s={3}>
        Author: {author}
      </Col>
    </Row>
  </li>
);

const Vote = ({ type, netVotes }) => (
  <div>
    <ul className={"clear-top center-align " + type}>
      <li><a href="#"><i className="fa fa-arrow-up" aria-hidden="true"></i></a></li>
      <li>{netVotes}</li>
      <li><a href="#"><i className="fa fa-arrow-down" aria-hidden="true"></i></a></li>
    </ul>
  </div>
);

const problem = {
  statement: "retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard retard",
  votes: 4,
  probid: 123,
  answer: "idk",
  author: "Cody Johnson",
  subject: "Algebra",
  solutions: [
    {author: "Cody", solution: "You can do it that way"},
    {author: "Cody", solution: "You can do it this way"}
  ],
  comments: [
    {author: "Cody", comment: "Pretty good problem"},
    {author: "Cody", comment: "Pretty bad problem"}
  ]
};

class ViewProbPage extends React.Component { 
  problemTabs = () => {
    const { proposal } = this.props;
    return ({
      "respond": {
        title: "Respond",
        view: (
          <form className="row">
            <Col s={12}>
              <ul className="inline-list">
                <li>This is a:</li>
                <li>
                  <Input name="feedback-type" type="radio" label="comment" defaultChecked="checked" />
                </li>
                <li>
                  <Input name="feedback-type" type="radio" label="alternate solution" />
                </li>
              </ul>
            </Col>
            <Col s={6} className="input-field">
              <textarea id="feedback" className="materialize-textarea"></textarea>
              <label htmlFor="feedback">Comment</label>
            </Col>
            <Col s={6}>
            </Col>
            <Col s={2} className="offset-s8">
              <Button waves="light" className="teal darken-3">Preview</Button>
            </Col>
            <Col s={2}>
              <Button waves="light" className="teal darken-3">Submit</Button>
            </Col>
          </form>
        )
      },
      "answer": {
        title: "Answer",
        view: <p>{ proposal.answer || 'No answer provided.' }</p>
      },
      "info": {
        title: "Information",
        view: (
          <ul>
            <li>Author: { proposal.author.name }</li>
            <li>Subject: { proposal.subject }</li>
            <li>Competition: { proposal.competition.short_name }</li>
            <li>Difficulty: { proposal.author.difficulty || 'N/A' }</li>
          </ul>
        )
      },
      "solutions": {
        title: <div>Solutions<Counter count={ proposal.official_soln.length } /></div>,
        view: proposal.official_soln.length > 0 ? (
          <ul>
            {
              proposal.official_soln.map((soln, key) => (
                <Feedback 
                  feedbackType="Solution" 
                  message={soln.body} 
                  author={soln.author.name} 
                  key={key} />
              ))
            }
          </ul>
        ) : ( <p>No solutions.</p> )
      },
      "test_solves": {
        title: <div>Test Solves<Counter count={ proposal.alternate_soln.length } /></div>,
        view: proposal.alternate_soln.length > 0 ? (
          <ul>
            {
              proposal.alternate_soln.map((soln, key) => (
                <Feedback 
                  feedbackType="Solution" 
                  message={soln.body} 
                  author={soln.author.name} 
                  key={key} />
              ))
            }
          </ul>
        ) : ( <p>No test solves.</p> )
      },
      "comments": {
        title: <div>Comments<Counter count={ proposal.comments.length } /></div>,
        view: proposal.comments.length > 0 ? (
          <ul>
            {
              proposal.comments.map((cmt, key) => (
                <Feedback 
                  feedbackType="Comment" 
                  message={cmt.comment} 
                  author={cmt.author.name} 
                  key={key} />
              ))
            }
          </ul>
        ) : ( <p>No comments.</p> )
      }
    })
  }

  componentWillMount() {
    const { match, getProposal } = this.props;
    getProposal(match.params.id);
  }

  render() {
    const { proposal } = this.props;
    return proposal.upvotes ? (
      <Row className="container">
        <h2 className="col s12 teal-text text-darken-4">View Problem<a href="#" className="teal-text text-darken-4 right"><i className="fa fa-trash" aria-hidden="true"></i></a><a href={"edit-problem/" + problem.probid} className="teal-text text-darken-4 right right-space"><i className="fa fa-pencil" aria-hidden="true"></i></a></h2>
        <Col s={1}>
          <Vote type="novote" netVotes={ proposal.upvotes.length } />
        </Col>
        <Col s={11} className="katex-preview">
          <p ref={ renderKaTeX }>{ proposal.statement }</p>
        </Col>
        <HorizontalNav tabs={ this.problemTabs() } active="respond" />
      </Row>
    ) : ( 
      <Row className="container">
        <Spinner /> 
      </Row>
    );
  }
}

const mapStateToProps = state => ({
        probError: state.problems.error,
        probMessage: state.problems.message,
        requestStatus: state.problems.requestStatus,
        proposal: state.problems.proposal
      }),
      mapDispatchToProps = dispatch => ({
        probErrorHandler: errorMessage => {
          probErrorHandler(dispatch, errorMessage);
        },
        getProposal: id => {
          getProposal(id)(dispatch);
        }
      });

export default connect(
  mapStateToProps, mapDispatchToProps
)(ViewProbPage);
