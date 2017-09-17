import React, { Component } from "react";
import { Row, Col, Collection, CollectionItem } from "react-materialize";

const About = () => (
  <Row className="container">
    <Col s={12}>
      <h2>About USMCA</h2>
      <p>
        Welcome to the USMCA beta test! This document will explain some of the website features and how to use them.
      </p>
  
      <p>
        Please note that being in beta, some website features are not yet functional and are displayed primarily as a demo. They will be functional as soon as possible, hopefully during the beta test itself. As such, if you come across a feature that appears to do nothing, most likely this is not a bug per se and is already known to USMCA administration.
      </p>

      <p>
        Please direct all bug reports, questions, and feature requests to the USMCA admins at <span className="bold-text">taisukey@andrew.cmu.edu</span>, <span className="bold-text">ctj@math.cmu.edu</span>, or <span className="bold-text">bogtro123@gmail.com</span>.
      </p>

      <h2>Definitions</h2>
      <p>
        Firstly, please note that for standardization purposes, we formalize some terminology here:
      </p>
      <Collection>
        <CollectionItem>A <span className="bold-text">competition</span> is an organization, such as HMMT or PUMaC, that hosts contests.</CollectionItem>
        <CollectionItem>A <span className="bold-text">contest</span> is a single event by a participating organization, e.g. HMMT February vs. HMMT November. An organization can have multiple contests.</CollectionItem>
        <CollectionItem>A <span className="bold-text">test</span> is a single round of a contest, such as HMMT Guts or PUMaC Individual Finals.</CollectionItem>
        <CollectionItem>A <span className="bold-text">problem</span> is, well, a problem. It is important to note that multi-part problems may be considered separate problems for accounting purposes, such as those often present in power round.</CollectionItem>
      </Collection>

      <h2>Problem Database Structure</h2>
      <p>
        Each competition has an individual problem database, which they will use for all their competitions. In addition, there is a shared problem database available, which all secure members (see below) have access to.
      </p>

      <p>
        Problems may be submitted to either the shared problem database or any problem database for a competition of which the author is a member. Once submitted, only czars have the ability to move problems in and out of the shared database (see below).
      </p>

      <h2>Member Types and Permissions</h2>
      <p>
        Members may be parts of competitions in various ways, and may have different permissions for each contest. There are 5 classes of members:
      </p>
      <Collection>
        <CollectionItem><span className="bold-text">Director</span>: Directors “own” their competition, and thus have access to all aspects of it. Directors may change the permissions of their competition’s members.</CollectionItem>
        <CollectionItem><span className="bold-text">Czar</span>: Problem czars are the head problem writers for their competitions. They have full control over their competition’s database and may move problems into/take problems from the shared database. Czars may also request and approve test solvers.</CollectionItem>
        <CollectionItem><span className="bold-text">Secure Member</span>: Directors may mark members of their organization “secure” once they verify their identity. Secure members retain all the permissions of regular members as well as gain access to the shared problem database. <span className="bold-text">IMPORTANT</span>: Marking a member as “secure” gives the member access to the shared problem database. Do <span className="bold-text">NOT</span> mark members as secure unless you are certain they are both trustworthy and responsible.</CollectionItem>
        <CollectionItem><span className="bold-text">Member</span>: A member can submit problems to databases of competitions they are members of, and can view their own problems (even if claimed by a different competition). They do not have access to the competition’s database.</CollectionItem>
        <CollectionItem><span className="bold-text">Test Solver</span>: A test solver is tied to a specific test and can only see the problems on that test. They will generally be assigned by responding to a request for test solvers.</CollectionItem>
      </Collection>

      <h2>Problem Sharing and Restrictions</h2>
      <p>
        Czars may, at any time, move problems from their competition’s database to the shared database. They may also “claim” problems from the shared database -- which moves the problem to their competition’s database -- subject to two restrictions:
      </p>
      <Collection>
        <CollectionItem>70% of each competition’s contest must be written by the competition’s own authors.</CollectionItem>
        <CollectionItem>At most 30% of a competition’s contest may be “claimed” from the public database at any point.</CollectionItem>
      </Collection>
    </Col>
  </Row>
);

export default About;
