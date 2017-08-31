import React from "react";
import { Row, Col, Input } from "react-materialize";
import { ProblemPreview } from "../utilities";

const results = [
  {_id: 123, upvotes: [], alternate_soln: [], official_soln: [], views: [], subject: "Algebra", contest: "CMIMC 2017", statement: "Let $n>1$ be an integer, and let $f:[a,b]\\to\\mathbb R$ be a continuous function, $n$-times differentiable on $(a,b)$, with the property that the graph of $f$ has $n+1$ collinear points. Prove that there exists a point $c\\in(a,b)$ with the property that $f^{(n)}(c)=0$."},
  {_id: 123, upvotes: [], alternate_soln: [], official_soln: [], views: [], subject: "Calculus", contest: "CMIMC 2017", statement: "Let $f$ be a three-times differentiable function (defined on $\\mathbb R$ and real-valued) such that $f$ has at least five distinct real zeros. Prove that $f+6f'+12f''+8f'''$ has at least two distinct real zeros."}
]

const DatabasePage = () => (
  <Row className="container">
    <Col s={12}>
      <h2 className="teal-text text-darken-4">Database</h2>
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
        results.map((proposal, key) => (
          <ProblemPreview problem={proposal} key={key}>sup</ProblemPreview>
        ))
      }
      <a className="load-more teal-text text-darken-3 underline-hover">Load more...</a>
    </Col>
  </Row>
);

export default DatabasePage;
