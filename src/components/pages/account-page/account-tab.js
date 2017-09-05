import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Row, Col, Input, Modal, Button } from "react-materialize";

import { RightButtonPanel } from "../../utilities";
import ChangePasswordForm from "../../forms/change-password";

class AccountTab extends React.Component {
  render() {
    const { user, admins } = this.props;
    if (!user.content || !admins.content) return <div></div>;
    const { name, email, university } = user.content;
    return (
      <Col s={12}>
        <h2 className="teal-text text-darken-4" style={{marginTop: "36px"}}>Account
          <Modal header="Edit Account" trigger={<a className="teal-text text-darken-4 right"><i className="fa fa-pencil" aria-hidden="true"></i></a>}>
            <Row>
              <form className="s12">
                <Input s={12} label="Name" defaultValue={name} />
                <Input s={12} label="Email" defaultValue={email} />
                <Input s={12} label="University" defaultValue={university} />
                <RightButtonPanel>
                  <Button className="teal darken-3" waves="light">Save</Button>
                </RightButtonPanel>
              </form>
            </Row>
          </Modal>
          </h2>
        <ul>
          <li>Name: {name}</li>
          <li>Email: {email}</li>
          <li>University: {university}</li>
          <li><Modal header="Change Password" trigger={<a className="teal-text text-darken-3 underline-hover">Change password</a>}>
            <ChangePasswordForm />
          </Modal></li>
        </ul>

        <h2 className="teal-text text-darken-4">Admins</h2>
        <p>If you have any problems, these are the contacts of the admins of USMCA:</p>
        <ul>
        {
          admins.content.map((admin, key) =>
            <li key={key}>{admin.name} ({admin.email})<a className="teal-text text-darken-3 right"><i className="fa fa-times" aria-hidden="true" /></a></li>
          )
        }
        </ul>
        <RightButtonPanel><Button className="teal darken-3" waves="light">Add Admin</Button><Button className="teal darken-3" waves="light">Step Down</Button></RightButtonPanel>
      </Col>
    );
  }
}

AccountTab.propTypes = {
  user: PropTypes.object.isRequired,
  admins: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.users.user,
  admins: state.users.admins
});

export default connect(mapStateToProps)(AccountTab);
