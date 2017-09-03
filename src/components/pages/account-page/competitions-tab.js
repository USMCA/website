import React from "react";
import { Button, Table, Input, Modal } from "react-materialize";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import _ from "lodash";
import moment from "moment";

import auth from "../../../auth";
import { memberCompetitions } from "../../../actions";
import { RightButtonPanel, VerticalNav } from "../../utilities";
import CreateContestForm from "../../forms/create-contest";
import CreateCompetitionForm from "../../forms/create-competition";
import JoinCompetitionForm from "../../forms/join-competition";

const makeURL = url => {
  if (!url) return url;
  const http = "http://",
        https = "https://",
        valid = (url.substr(0, http.length) === http) || 
                (url.substr(0, https.length) === https);
  return valid ? url : http + url;
}

const DIRECTOR = "director",
      PENDING_DIRECTOR = "pending director",
      SECURE = "secure member",
      MEMBER = "member",
      NONMEMBER = "nonmember";

const competitionMembership = (competition, userId, populated = true) => {
  const finder = populated ? 
    user => user._id === userId : // users are populated
    user => user === userId; // users are ids themselves
  if (_.find(competition.directors, finder))
    return competition.valid ? DIRECTOR : PENDING_DIRECTOR;
  else if (_.find(competition.secure_members, finder)) return SECURE;
  else if (_.find(competition.members, finder)) return MEMBER;
  else return NONMEMBER;
}

const locationsString = locations => {
  return (locations.length === 0) ? "N/A" : (
    locations.map(
      ({ site, address }) => address ? `${site} (${address})` : site
    ).join(", ")
  );
}

class CompetitionsTab extends React.Component {
  componentWillMount() {
    this.props.memberCompetitions();
  }

  competitionTabs = competition => {
    const membership = competitionMembership(competition, auth.userId());
    const memberView = (user, idx) => membership === DIRECTOR ? (
      <tr key={ idx }>
        <td>{ user.name }</td>
        <td>{ user.email }</td>
        <td>{ competitionMembership(competition, user._id) } (<a className="teal-text text-darken-3">change permissions</a>)</td>
        <td className="center-align"><a className="black-text"><i className="fa fa-times" aria-hidden="true" /></a></td>
      </tr>
    ) : (
      <tr key={ idx }>
        <td>{ user.name }</td>
        <td>{ user.email }</td>
        <td>{ competitionMembership(competition, user._id) }</td>
      </tr>
    );
    const contestView = (contest, idx) => {
      return (
        <div style={{borderBottom: "1px solid #cfd8dc"}} key={idx}>
          <h3>{ contest.name }<a className="right black-text"><i className="fa fa-times" aria-hidden="true" /></a><Modal header="Update Contest" trigger={<a className="right right-space black-text"><i className="fa fa-pencil" aria-hidden="true" /></a>}><CreateContestForm contest={ contest } competition_id={ competition._id } /></Modal></h3>
          <ul>
            <li><a href="/view-contest" className="teal-text text-darken-3">View contest</a></li>
            <li>Date: { contest.date ? moment(contest.date).format('ll') : "N/A" }</li>
            <li>Test solve deadline: { contest.test_solve_deadline ? moment(contest.test_solve_deadline) : "N/A" }</li>
            <li>Location(s): { locationsString(contest.locations) }</li>
            <li>Status: <span className="bold-text">{ contest.active ? "active" : "inactive" }</span></li>
          </ul>
        </div>
      );
    }
    return {
      "info": {
        title: () => "Information",
        view: () => <div className="round-container">
          <ul>
            <li><h3>Competition Info<a className="right black-text"><i className="fa fa-pencil" aria-hidden="true" /></a></h3></li>
            <li>Name: { competition.name }</li>
            <li>Short name: { competition.short_name }</li>
            <li>Website: <a href={ makeURL(competition.website) } className="teal-text text-darken-3">{ competition.website }</a></li>
            <li><h3>Membership Info</h3></li>
            <li>Your are a: <span className="bold-text">{ membership }</span></li>
            { membership === DIRECTOR &&  <li><a className="teal-text text-darken-3">Step down as director</a></li> }
            <li><a className="teal-text text-darken-3">Leave competition</a></li>
            { 
              (membership === DIRECTOR || membership === SECURE) && (
                <div>
                  <li><h3>Database</h3></li>
                  <li><Link to={ `/view-database/${competition._id}` } className="btn teal darken-3">View database</Link></li>
                </div>
              )
            }
          </ul>
        </div>
      },
      "members": {
        title: () => "Members",
        view: () => <div className="round-container">
          <Button className="teal darken-3">Add new member</Button>
          <h3>Roster</h3>
          <Table className="roster">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Membership</th>
                { membership === DIRECTOR && <th className="center-align">Remove</th> }
              </tr>
            </thead>

            <tbody>
              { competition.directors.map(memberView) }
              { competition.secure_members.map(memberView) }
              { competition.members.map(memberView) }
            </tbody>
          </Table>
        </div>
      },
      "contests": {
        title: () => "Contests",
        view: () => <div className="round-container">
          <Modal header="Create Contest" trigger={ <Button className="teal darken-3">Create contest</Button> }>
            <CreateContestForm competition_id={ competition._id } />
          </Modal>
          { 
            competition.contests.length > 0 ? (
              _.reverse(_.sortBy(competition.contests, 
                  contest => new Date(contest.date)
                ).map(contestView)
              )
            ) : (
              <p>No contests created yet!</p>
            ) }
        </div>
      }
    };
  }

  render () {
    const { competitions: { content, message, requestStatus } } = this.props;
    return (
      <div style={{marginTop: "36px"}}>
        <Modal
          header="Request to Join a Competition"
          trigger={ <Button className="teal darken-3">Join a competition</Button> }>
          <JoinCompetitionForm />
        </Modal>
          {
            content && content.map((competition, idx) => (
              <div key={idx}>
                <h2 className="teal-text text-darken-3">{ competition.short_name }</h2>
                <div style={{borderBottom: "1px solid #cfd8dc"}}>
                  <VerticalNav tabs={ this.competitionTabs(competition) } active="info" />
                </div><br />
              </div>
            ))
          }
        <RightButtonPanel>
          Does your competition want to join USMCA? <Modal header="Form a Competition" trigger={<a className="teal-text text-darken-3">Register your competition.</a>}>
            <CreateCompetitionForm />
          </Modal>
        </RightButtonPanel>
      </div>
    );
  }
}

const mapStateToProps = state => ({
        competitions: state.competitions.memberCompetitions
      }),
      mapDispatchToProps = dispatch => ({
        memberCompetitions: () => { memberCompetitions({ info: true })(dispatch); }
      });

export default connect(mapStateToProps, mapDispatchToProps)(CompetitionsTab);
