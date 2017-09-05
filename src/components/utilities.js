import React from "react";
import PropTypes from "prop-types";
import { Row, Col, Modal, Button } from "react-materialize";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";
import $ from "jquery";
import Clipboard from "clipboard";

import CommentForm from "./forms/comment";
import TakeProblemForm from "./forms/take-problem";

import renderKaTeX from "../katex";
import { respondRequest, userPut } from "../actions";
import {
  USER_COMP_RES,
  USER_JOIN_RES,
  COMP_REQ,
  COMP_REQ_JOIN
} from "../actions/types";
import { requestTypes } from "../../constants";

const datify = (created, updated) => (
  updated ?
  ((created === updated) ? moment(created).format("MMM Do, YYYY, h:mm a") : "Edited " + moment(updated).format("MMM Do, YYYY, h:mm a")) :
  moment(created).format("MMM Do, YYYY, h:mm a")
)

const LoadMore = () => (
  <a className="load-more teal-text text-darken-3 underline-hover">Load more...</a>
);

const Counter = ({ count }) => (
  <span className="counter">{count}</span>
);

const RightButtonPanel = ({ children, marginBottom }) => (
  <div>
    <div className="right-button-panel" style={{ marginBottom }}>
      { children }
    </div>
    <br className="clear-float" />
  </div>
)

const Notification = ({ className, label, author, title, message, onClick }) => {
  return (
    <li className={className}>
      <a className="right"><i className="fa fa-times" aria-hidden="true"></i></a>
      <a onClick={ onClick }><span className="select-circle"></span></a>
      <Modal header={author + ": " + title} trigger={
        <a className="underline-hover">
          <span className="bold-text">{ author }</span>: { title }
        </a>
      }>{ message }</Modal>
    </li>
  );
};

/* smart component for approving requests */
const RequestDumb = ({ request, respondRequest }) => {
  /* different response based on action_type of request */
  const responseHandleClick = {
    [COMP_REQ]: response => {
      return () => { respondRequest(request, response, USER_COMP_RES); };
    },
    [COMP_REQ_JOIN]: response => {
      return () => { respondRequest(request, response, USER_JOIN_RES); };
    }
  };
  const makeHandleClick = responseHandleClick[request.action_type];
  if (!makeHandleClick) return <div></div>;
  return (
    <li className="white">
      <Row>
        <Col s={10}>
          { request.body }
        </Col>
        <Col s={2}>
          <Modal header="Confirm Reject" trigger={<a className="right"><i className="fa fa-times" aria-hidden="true" /></a>} actions={<div>
            <Button flat modal="close" waves="light">Cancel</Button>
            <Button flat modal="close" waves="light"
              onClick={ makeHandleClick(requestTypes.REJECT) }>Confirm</Button>
          </div>}>
            Are you sure you want to reject this request?
          </Modal>
          <Modal header="Confirm Accept" trigger={<a className="right right-space"><i className="fa fa-check" aria-hidden="true" /></a>}actions={<div>
            <Button flat modal="close" waves="light">Cancel</Button>
            <Button flat modal="close" waves="light"
              onClick={ makeHandleClick(requestTypes.ACCEPT) }>Confirm</Button>
          </div>}>
            Are you sure you want to accept this request?
          </Modal>
        </Col>
      </Row>
    </li>
  );
}
RequestDumb.propTypes = {
  request: PropTypes.object.isRequired,
  respondRequest: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
      }),
      mapDispatchToProps = dispatch => ({
        respondRequest: (request, response, type, action_type) => {
          respondRequest(request, response, type, action_type)(dispatch);
        }
      });
const Request = connect(mapStateToProps, mapDispatchToProps)(RequestDumb);

const Comment = ({ comment }) => (
  <li ref={ renderKaTeX }>{ comment.body }
  &mdash; <span className="comment-author">
    <span className="author-name">{ comment.author.name }</span>
    <i>{ datify(comment.created, comment.updated) }</i>
    <a><i className="fa fa-pencil" aria-hidden="true"></i></a>
    <a><i className="fa fa-trash" aria-hidden="true"></i></a>
  </span></li>
)

class CommentList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showCommentForm: false, showComments: false };
  }

  toggleCommentForm = () => {
    this.setState({ showCommentForm: !this.state.showCommentForm });
  }

  toggleComments = () => {
    this.setState({ showComments: !this.state.showComments });
  }

  render() {
    const { comments, problem_id, solution_id } = this.props;
    return (
      <ul>
        <li>
          <a className="teal-text text-darken-3" onClick={ this.toggleComments }>
            <i className={ this.state.showComments ? "fa fa-caret-up" : "fa fa-caret-down" } aria-hidden="true"/> <span className="underline-hover">{ this.state.showComments ? "Hide comments" : "Show comments" } ({ comments.length })</span>
          </a>
        </li>
        {
          this.state.showComments && (
            (comments.length > 0) ? (
              comments.map((comment, key) => (
                <Comment comment={comment} key={key}/>
              ))
            ) : (<p>No comments.</p>)
          )
        }
        <li>
          {
            this.state.showCommentForm ? 
              <CommentForm 
                problem_id={ problem_id } 
                solution_id={ solution_id }
                afterSubmit={ () => { this.state.showCommentForm = false; } } /> :
              <a 
                className="teal-text text-darken-3 underline-hover" 
                onClick={ this.toggleCommentForm }>
                Add a comment
              </a>
          }
        </li>
      </ul>
    )
  }
}

class ProblemPreview extends React.Component  {
  render() {
    const { problem, publicDatabase } = this.props;
    return (
      <Row className="problem">
        <Col offset="s2" s={10}>
          <span className="small-stat">{ problem.views.length } Views &bull; { problem.alternate_soln.length } Solves &bull; { problem.upvotes.length } Upvotes</span>
          { !publicDatabase && (
              <ul className="problem-options">
                <li><a className="grey-text"><i className="fa fa-pencil" aria-hidden="true" /></a></li>
                <li><a className="grey-text"><i className="fa fa-trash" aria-hidden="true" /></a></li>
              </ul>
            )
          }
        </Col>
        <Col s={2} className="center-align">
          <div className="upvote upvoted">
            <i className="fa fa-clipboard" aria-hidden="true" /> <a className="underline-hover" ref={ elem => { new Clipboard(elem); } } data-clipboard-text={ problem._id }>Copy ID</a>
          </div>
        </Col>
        <Col m={ publicDatabase ? 5 : 10 } s={10}>
          <div className="katex-preview">
            <Link
              to={ "/view-problem/" + problem._id.toString() }
              className="black-text underline-hover">
              <div ref={ renderKaTeX }>
                { problem.statement }
              </div>
            </Link>
          </div>
        </Col>
        { publicDatabase && (
            <Col m={5} s={12}>
              <TakeProblemForm problem_id={ problem._id }/>
            </Col> 
          )
        }
      </Row>
    );
  }
}
ProblemPreview.propTypes = {
  problem: PropTypes.object.isRequired,
  publicDatabase: PropTypes.bool // input for taking shared problem
};

class ExtendedProblemPreview extends React.Component  {
  render() {
    const { problem } = this.props;
    return (
      <Row className="problem">
        <Col s={12}>
          <span className="small-stat">{ problem.views.length } Views &bull; { problem.alternate_soln.length } Solves &bull; { problem.upvotes.length } Upvotes</span>
          <ul className="problem-options">
            <li><a className="grey-text"><i className="fa fa-pencil" aria-hidden="true"/></a></li>
            <li><a className="grey-text"><i className="fa fa-trash" aria-hidden="true"/></a></li>
          </ul>
        </Col>
        <Col s={12}>
          <div className="katex-preview">
            <div ref={ renderKaTeX }>
              { problem.statement }
            </div>
          </div>
        </Col>
        <Col m={3} s={12} className="problem-stats">
          <span><div className="upvote upvoted"><i className="fa fa-thumbs-up" aria-hidden="true"></i><a className="underline-hover">Upvote</a></div></span><br />
          <span><div className="upvote upvoted"><i className="fa fa-clipboard" aria-hidden="true" /> <a className="underline-hover" ref={ elem => { new Clipboard(elem); } } data-clipboard-text={ problem._id }>Copy ID</a></div></span><br />
          <span className="bold-text">{ problem.author.name }</span><br />
          <span className="small-stat"><i>{ datify(problem.created, problem.updated) }</i></span>
        </Col>
        <Col m={9} s={12} className="comments">
          <CommentList comments={problem.comments} problem_id={ problem._id } />
        </Col>
      </Row>
    );
  }
}

class Solution extends React.Component  {
  render() {
    const { solution } = this.props;
    return (
      <Row className="problem">
        <Col s={12}>
          <span className="small-stat">{ solution.upvotes.length } Upvotes</span>
          <ul className="problem-options">
            <li><a className="grey-text"><i className="fa fa-pencil" aria-hidden="true"></i></a></li>
            <li><a className="grey-text"><i className="fa fa-trash" aria-hidden="true"></i></a></li>
          </ul>
        </Col>
        <Col s={12}>
          <div className="katex-preview">
            <div ref={ renderKaTeX }>
              { solution.body }
            </div>
          </div>
        </Col>
        <Col m={3} s={12} className="problem-stats">
          <span><div className="upvote upvoted"><i className="fa fa-thumbs-up" aria-hidden="true"></i><a className="underline-hover">Upvote</a></div></span><br />
          <span className="bold-text">{ solution.author.name }</span><br />
          <span className="small-stat"><i>{ datify(solution.created, solution.updated) }</i></span>
        </Col>
        <Col m={9} s={12} className="comments">
          <CommentList comments={solution.comments} solution_id={ solution._id } />
        </Col>
      </Row>
    );
  }
}

class HorizontalNav extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tabs: props.tabs,
      active: props.active
    };
  }

  render() {
    const { tabs, active } = this.state;
    if (!tabs) return <div />;
    if (tabs[active] === undefined) {
      throw 'Specified active tab is not in the tabs object.';
      return <div />;
    }

    const activeProp = (this.props.childProps || {})[active],
          headerProps = (this.props.headerProps || {});
    return (
      <div>
        <Col s={12} className="horizontal-nav">
          {
            Object.keys(tabs).map((key, idx) => {
              const tab = tabs[key],
                    className = (key === active) ? "left active-tab" : "left",
                    props = {
                      key: idx,
                      className: className,
                      onClick: evt => { this.setState({ active: key }); }
                    };
              return tab.to ?
                <Link to={ tab.to } { ...props }>{ tab.title(headerProps[key]) }</Link> :
                <a { ...props }>{ tab.title(headerProps[key]) }</a>;
            })
          }
        </Col>
        <Col s={12}>
          <div>{ tabs[active].view(activeProp) }</div>
        </Col>
      </div>
    );
  }
}

class VerticalNav extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tabs: props.tabs,
      active: props.active
    };
  }

  render() {
    const { tabs, active } = this.state;
    if (!tabs) return <div />;
    if (tabs[active] === undefined) {
      throw 'Specified active tab is not in the tabs object.';
      return <div />;
    }

    const activeProp = (this.props.childProps || {})[active],
          headerProps = (this.props.headerProps || {});
    return (
      <Row>
        <Col s={3}>
          <ul className="vertical-nav" style={{marginTop: "0"}}>
            {
              Object.keys(tabs).map((key, idx) => {
                const tab = tabs[key],
                      className = (key === active) ? "active-tab" : "";
                return (
                  <li key={idx}>
                    <a
                      className={ className }
                      onClick={ evt => { this.setState({ active: key }); } }>
                      { tab.title(headerProps[key]) }
                    </a>
                  </li>
                );
              })
            }
          </ul>
        </Col>
        <Col s={9}>
          <div>{ tabs[active].view(activeProp) }</div>
        </Col>
      </Row>
    );
  }
}

export {
  Notification,
  RightButtonPanel,
  ProblemPreview,
  ExtendedProblemPreview,
  Solution,
  LoadMore,
  Counter,
  HorizontalNav,
  VerticalNav,
  Request
};
