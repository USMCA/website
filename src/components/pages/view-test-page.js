import React, {Component} from "react";
import { SortableContainer, SortableElement, SortableHandle, arrayMove } from 'react-sortable-hoc';
import { Row, Col, Modal, Input } from "react-materialize";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

import Error from "../error";
import Spinner from "../spinner";
import renderKaTeX from "../../katex";
import { getTest, removeTestProb } from "../../actions";
import { requestStatuses } from "../../actions/types";
import AddProblemForm from "../forms/add-problem";

const { SUCCESS, PENDING, ERROR, IDLE } = requestStatuses;

function removeProblem(key, removeElem) {
  $('#problem' + key).fadeOut(300, function(){ $(this).remove();});
  removeElem(key);
  console.log(key);
}

const DragHandle = SortableHandle(() => <a className="grey-text text-darken-1"><i className="fa fa-bars" aria-hidden="true"></i></a>); // This can be any component you want

const SortableProblem = SortableElement(({ problem, myKey, removeElem }) => (
  <li id={"problem" + myKey} className="test-list-item">
    <div className="katex-preview">
      <Row>
        <Col s={1}>
          <DragHandle />
        </Col>
        <Col s={10}>
          <Link to={ `/view-problem/${problem._id}` } className="teal-text text-darken-3 underline-hover"><div ref={ renderKaTeX }>{ problem.statement }</div></Link>
        </Col>
        <Col s={1}>
          <a className="grey-text text-darken-1 right" onClick={() => removeProblem(myKey, removeElem)}><i className="fa fa-times" aria-hidden="true"></i></a>
        </Col>
      </Row>
    </div>
  </li>
));

const SortableProblemList = SortableContainer(({ problems, removeElem }) => {
  return (
    <ol className="test-list">
      {
        problems.map((problem, key) => (
          <SortableProblem problem={problem} key={key} myKey={key} index={key} removeElem={removeElem} />
        ))
      }
    </ol>
  );
});

function removeElementWithIndex(arr, index) {
  for (var i = 0; i < arr.length; i++)
    if (arr[i].index == index)
      return arr.splice(i);
  return arr;
}

class TestProblems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      problems: props.test.problems
    };
  }

  componentDidReceiveProps() {
    this.setState({ problems: this.props.test.problems });
  }

  onSortEnd = ({oldIndex, newIndex}) => {
    let {problems} = this.state;

    this.setState({
      problems: arrayMove(problems, oldIndex, newIndex),
    });
  };

  removeElem = (i) => {
    let {problems} = this.state;
    const { removeTestProb, test } = this.props,
          test_id = test._id,
          problem_id = problems[i];
    removeTestProb(test_id, problem_id);
    this.setState({
      problems: removeElementWithIndex(problems, i),
    });
  }

  addElem = (statement) => {
    let {problems} = this.state;

    problems.push(statement);

    this.setState({
      problems: problems,
    });
  }

  render() {
    const { problems } = this.state;
    const { test } = this.props;

    return <div>
      <SortableProblemList problems={problems} removeElem={this.removeElem} onSortEnd={this.onSortEnd} useDragHandle={true} />
      <Modal header='Add Problem' trigger={<a className="teal-text text-darken-3"><i className="fa fa-plus" aria-hidden="true"></i></a>}>
        <AddProblemForm test_id={ test._id } />
      	<a onClick={() => this.addElem("hello")}>Click me, u wont</a>
      </Modal>
    </div>;
  }
}

class ViewTestPage extends React.Component {
  componentWillMount() {
    const { match, getTest } = this.props;
    getTest(match.params.id);
  }

  render() {
    const { 
            testData: { content, requestStatus, message },
            removeTestProb
          } = this.props,
          test = content;
    console.log(test);
    return (
      <div>
        { test && (
            <Row className="container">
              <h2 className="teal-text text-darken-4"><Link to={ `/view-contest/${test.contest._id}` } className="teal-text text-darken-3 underline-hover">{ test.contest.name }</Link></h2>
              <h3 className="teal-text text-darken-4">{ test.name }</h3>
              <p>This test consists of 10 problems.</p>
              <TestProblems test={ test } removeTestProb={ removeTestProb } />
            </Row>
          )
        }
        <Error error={ requestStatus === ERROR } message={ message }/>
        { (requestStatus === PENDING) && <Spinner /> }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  testData: state.contests.test,
});
const mapDispatchToProps = dispatch => ({
  getTest: id => { getTest(id)(dispatch); },
  removeTestProb: (test_id, problem_id) => { 
    removeTestProb(test_id, problem_id)(dispatch);
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(ViewTestPage);
