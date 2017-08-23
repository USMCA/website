import React from "react";
import { Row, Col, Button, Collapsible, CollapsibleItem, Input, Tabs, Tab } from "react-materialize";
import { HorizontalNav, Counter } from "../utilities";

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
        Author: Cody
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

const problemTabs = {
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
    view: (
      <p>{problem.answer}</p>
    )
  },
  "info": {
    title: "Information",
    view: (
      <ul>
        <li>Author: Cody</li>
        <li>Contest: CMIMC</li>
        <li>Difficulty: Easy</li>
      </ul>
    )
  },
  "solutions": {
    title: <div>Solutions<Counter count="5" /></div>,
    view: (
      <ul>
        {
          problem.solutions.map((soln, key) => (
            <Feedback feedbackType="Solution" message={soln.solution} author={soln.author} key={key} />
          ))
        }
      </ul>
    )
  },
  "comments": {
    title: <div>Comments<Counter count="5" /></div>,
    view: (
      <ul>
        {
          problem.comments.map((cmt, key) => (
            <Feedback feedbackType="Comment" message={cmt.comment} author={cmt.author} key={key} />
          ))
        }
      </ul>
    )
  }
}

const ViewProbPage = () => (
  <Row className="container">
    <h2 className="col s12 teal-text text-darken-4">View Problem<a href="#" className="teal-text text-darken-4 right"><i className="fa fa-trash" aria-hidden="true"></i></a><a href={"edit-problem/" + problem.probid} className="teal-text text-darken-4 right right-space"><i className="fa fa-pencil" aria-hidden="true"></i></a></h2>
    <Col s={1}>
      <Vote type="novote" netVotes={problem.votes} />
    </Col>
    <Col s={11} className="katex-preview">
      <p>{problem.statement}</p>
    </Col>
    <HorizontalNav tabs={ problemTabs } active="respond" />
  </Row>
);

export default ViewProbPage;
