import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Row, Col, Table, Button, Modal, Input } from "react-materialize";

import { RightButtonPanel } from "../../utilities";
import CreateCompetitionForm from "../../forms/create-competition";

const CompetitionsTableDumb = ({ competitions }) => { 
  const statusOptions = {
    "Member": <div><li><a href="#" className="teal-text text-darken-3">Leave competition</a></li></div>,
    "Director": (
      <div>
        <li><a href="#" className="teal-text text-darken-3">Leave competition</a></li>
        <li><a href="#" className="teal-text text-darken-3">Add new members</a></li>
        <li><a href="#" className="teal-text text-darken-3">Add new directors</a></li>
        <li><a href="#" className="teal-text text-darken-3">Step down as director</a></li>
      </div>
    ),
    "Pending": <div><li><a href="#" className="teal-text text-darken-3">Cancel request</a></li></div>,
    "Pending Director": <div><li><a href="#" className="teal-text text-darken-3">Cancel request</a></li></div>
  };

  return (competitions.length > 0) ? (
    <Table>
      <thead>
        <tr>
          <th>Competition</th>
          <th>Membership Status</th>
          <th>Options</th>
        </tr>
      </thead>

      <tbody>
        {
          competitions.map((competitionInfo, key) =>
            <tr key={key}>
              <td>{competitionInfo.competition.short_name}</td>
              <td>{competitionInfo.membershipStatus}</td>
              <td>
                <ul>
                  { statusOptions[competitionInfo.membershipStatus] }
                </ul>
              </td>
            </tr>
          )
        }
      </tbody>
    </Table>
  ) : (
    <div><p>Not involved in any competitions.</p></div>
  );
};

CompetitionsTableDumb.propTypes = {
  competitions: PropTypes.array.isRequired
};
const mapStateToProps = state => ({
        competitions: state.competitions.memberCompetitions
      });
const CompetitionsTable = connect(mapStateToProps)(CompetitionsTableDumb);

const CompetitionsTab = () => (
  <Col s={12}>
    <Row>
      <CompetitionsTable />
      <RightButtonPanel>
        <form>
          <Modal header="Join a Competition" trigger={<Button className="teal darken-3">Join a Competition</Button>} actions={<div>
            <Button flat modal="close" waves="light">Cancel</Button>
            <Button flat modal="close" waves="light">Join</Button>
            </div>}>

            <Input label="Search competitions" />
            Your join request will be reviewed by the directors of (CMIMC).
          </Modal>
        </form>
      </RightButtonPanel>
      <p className="right">Does your competition want to join USMCA? <Modal header="Form a Competition" trigger={<a href className="underline-hover teal-text text-darken-3">Form a new competition</a>}>
        <CreateCompetitionForm />
      </Modal>.</p>
    </Row>
  </Col>
);

export default CompetitionsTab;
