import React from "react";
import { Row, Col, Button, Collapsible, CollapsibleItem, Input } from "react-materialize";
import { connect } from "react-redux";
import _ from "lodash"

import auth from "../../auth";
import renderKaTeX from "../../katex";
import { getProposal, upvoteProblem } from "../../actions";
import { ProblemPreview, ExtendedProblemPreview, Solution, HorizontalNav, Counter } from "../utilities";
import TestSolveForm from "../forms/test-solve";
import SolutionForm from "../forms/solution";
import CommentForm from "../forms/comment";
import Spinner from "../spinner";

class Vote extends React.Component {
  toggle = () => {
    this.upvote.className = "upvoted";
  }

  render() {
    const { type, netVotes, onClick } = this.props;

    return (<div>
      <ul className={"clear-top center-align " + type}>
        <li ref={ elem => {this.upvote = elem;} }><a><i className="fa fa-arrow-up" aria-hidden="true" onClick={ onClick } /></a> {netVotes}</li>
      </ul>
    </div>);
  }
}

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
        view: <p ref={ renderKaTeX }>{ problem.answer || 'No answer provided.' }</p>
      },
      "solutions": {
        title: <div>Solutions<Counter count={ problem.official_soln.length } /></div>,
        view: problem.official_soln.length > 0 ? (
          <ul>
            {
              problem.official_soln.map((soln, key) => (
                <Solution solution={soln} key={key} />
              ))
            }
          </ul>
        ) : ( <p>No solutions.</p> )
      },
      "test-solves": {
        title: <div>Test Solves<Counter count={ problem.alternate_soln.length } /></div>,
        view: (
          <div>
            {
              (problem.alternate_soln.length > 0) && (
              <ul>
                {
                  problem.alternate_soln.map((soln, key) => (
                    <Solution solution={soln} key={key} />
                  ))
                }
              </ul>)
            }
            <div>
              <TestSolveForm />
            </div>
         </div>
        )
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

  upvoted = () => {
    const { proposal: { content } } = this.props,
          problem = content;
    return !!(_.find(problem.upvotes, id => id === auth.userId()));
  }

  render() {
    const { proposal: { content, message }, upvote } = this.props,
          problem = content;
    return problem ? (
      <Row className="container">
        <div style={{marginTop: "36px"}}>
          <ExtendedProblemPreview problem={problem} />
        </div>
        <Col s={12}>
          {
            this.state.showDiscussion ? (
              <div className="toggle-discussion">
                <a className="teal-text text-darken-3 underline-hover" onClick={ this.toggleDiscussion }>
                  <h3><i className="fa fa-caret-up" aria-hidden="true" /> Hide Discussion</h3>
                </a>
                <HorizontalNav tabs={ this.problemTabs() } active="info" />
              </div>
            ) : (
              <div className="toggle-discussion">
                <a className="teal-text text-darken-3 underline-hover" onClick={ this.toggleDiscussion }>
                  <h3><i className="fa fa-caret-down" aria-hidden="true" /> Show Discussion</h3>
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
        getProposal: id => {
          getProposal(id)(dispatch);
        },
        upvote: id => {
          upvoteProblem(id)(dispatch);
        }
      });

export default connect(
  mapStateToProps, mapDispatchToProps
)(ViewProbPage);
