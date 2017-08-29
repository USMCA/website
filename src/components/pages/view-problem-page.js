import React from "react";
import { Row, Col, Button, Collapsible, CollapsibleItem, Input } from "react-materialize";
import { connect } from "react-redux";

import renderKaTeX from "../../katex";
import { probErrorHandler, getProposal } from "../../actions";
import { HorizontalNav, Counter } from "../utilities";
import TestSolveForm from "../forms/test-solve";
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
      <li><a href="#"><i className="fa fa-arrow-up" aria-hidden="true" /></a></li>
      <li>{netVotes}</li>
      <li><a href="#"><i className="fa fa-arrow-down" aria-hidden="true" /></a></li>
    </ul>
  </div>
);

class ViewProbPage extends React.Component { 
  constructor(props) {
    super(props);
    this.state = { showDiscussion: false };
  }

  problemTabs = () => {
    const { proposal: { content, message } } = this.props,
          problem = content;
    return ({
      "info": {
        title: "Information",
        view: (
          <ul>
            <li>Author: { problem.author.name }</li>
            <li>Subject: { problem.subject }</li>
            <li>Competition: { problem.competition.short_name }</li>
            <li>Difficulty: { problem.author.difficulty || 'N/A' }</li>
          </ul>
        )
      },
      "answer": {
        title: "Answer",
        view: <p>{ problem.answer || 'No answer provided.' }</p>
      },
      "solutions": {
        title: <div>Solutions<Counter count={ problem.official_soln.length } /></div>,
        view: problem.official_soln.length > 0 ? (
          <ul>
            {
              problem.official_soln.map((soln, key) => (
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
      "test-solves": {
        title: <div>Test Solves<Counter count={ problem.alternate_soln.length } /></div>,
        view: (
          <div>
            <div>
              <TestSolveForm />
            </div>
            {
              problem.alternate_soln.length > 0 ? (
              <ul>
                {
                  problem.alternate_soln.map((soln, key) => (
                    <Feedback 
                      feedbackType="Solution" 
                      message={soln.body} 
                      author={soln.author.name} 
                      key={key} />
                  ))
                }
              </ul>
              ) : ( <p>No test solves.</p> )
            }
         </div>
        )
      },
      "comments": {
        title: <div>Comments<Counter count={ problem.comments.length } /></div>,
        view: problem.comments.length > 0 ? (
          <ul>
            {
              problem.comments.map((cmt, key) => (
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

  toggleDiscussion = () => {
    this.state.showDiscussion = !this.state.showDiscussion;
    this.forceUpdate();
  }

  render() {
    const { proposal: { content, message } } = this.props,
          problem = content;
    return problem ? (
      <Row className="container">
        <h2 className="col s12 teal-text text-darken-4">View Problem<a href="#" className="teal-text text-darken-4 right"><i className="fa fa-trash" aria-hidden="true"></i></a><a href={"edit-problem/" + problem._id} className="teal-text text-darken-4 right right-space"><i className="fa fa-pencil" aria-hidden="true"></i></a></h2>
        <Col s={1}>
          <Vote type="novote" netVotes={ problem.upvotes.length } />
        </Col>
        <Col s={11} className="katex-preview">
          <p ref={ renderKaTeX }>{ problem.statement }</p>
        </Col>
        <Col s={12}>
          { 
            this.state.showDiscussion ? (
              <div>
                <a onClick={ this.toggleDiscussion }>
                  <i className="fa fa-caret-up" aria-hidden="true" /> Hide Discussion
                </a>
                <HorizontalNav tabs={ this.problemTabs() } active="info" /> 
              </div>
            ) : (
              <div>
                <a onClick={ this.toggleDiscussion }>
                  <i className="fa fa-caret-down" aria-hidden="true" /> Show Discussion
                </a>
              </div>
            )
          }
        </Col>
      </Row>
    ) : ( 
      <Row className="container">
        <Spinner /> 
      </Row>
    );
  }
}

const mapStateToProps = state => ({
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
