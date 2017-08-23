import React from "react";
import { Row, Col, Input } from "react-materialize";
import { ProblemPreview } from "../utilities";

const results = [
  {probid: 123, votes: 0, solves: 1, views: 2, subject: "Algebra", contest: "CMIMC 2017", statement: "Let $n>1$ be an integer, and let $f:[a,b]\\to\\mathbb R$ be a continuous function, $n$-times differentiable on $(a,b)$, with the property that the graph of $f$ has $n+1$ collinear points. Prove that there exists a point $c\\in(a,b)$ with the property that $f^{(n)}(c)=0$."},
  {probid: 123, votes: 1, solves: 15, views: 20, subject: "Calculus", contest: "CMIMC 2017", statement: "Let $f$ be a three-times differentiable function (defined on $\\mathbb R$ and real-valued) such that $f$ has at least five distinct real zeros. Prove that $f+6f'+12f''+8f'''$ has at least two distinct real zeros."}
]

const DatabasePage = () => (
  <Row className="container">
    <Col s={12}>
      <h2 className="teal-text text-darken-4">Database</h2>
      <Row>
        <form className="col s12">
          <Row>
            <Input s={4} type="select" label="Contest" multiple>
                <option value="" disabled>Choose your option</option>
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
                <option value="3">Option 3</option>
            </Input>
            <Input s={4} type="select" label="Subject" multiple>
                <option value="">Choose your option</option>
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
                <option value="3">Option 3</option>
            </Input>
            <Input s={4} type="select" label="Sort by" multiple>
                <option value="">Choose your option</option>
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
                <option value="3">Option 3</option>
            </Input>
            <Col s={12}>
              <ul className="inline-list">
                <li>
                  <Input type="checkbox" label="original problems" defaultChecked="checked" />
                </li>
                <li>
                  <Input type="checkbox" label="borrowed problems" />
                </li>
                <li>
                  <Input type="checkbox" label="easy" defaultChecked="checked" />
                </li>
                <li>
                  <Input type="checkbox" label="medium" defaultChecked="checked" />
                </li>
                <li>
                  <Input type="checkbox" label="hard" defaultChecked="checked" />
                </li>
              </ul>
            </Col>
          </Row>
        </form>
      </Row>
      <h3>Results</h3>
      {
        results.map((proposal, key) => (
          <ProblemPreview problem={proposal} key={key}>sup</ProblemPreview>
        ))
      }
      <a href="#" className="load-more teal-text text-darken-3 underline-hover">Load more...</a>
    </Col>
  </Row>
);

export default DatabasePage;
