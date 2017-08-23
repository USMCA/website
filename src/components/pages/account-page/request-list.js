import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { requestEnum } from "../../../../constants";
import { Request, LoadMore } from "../../utilities";

const RequestList = ({ requests, type }) => {
  requests = requests.filter(request => request.type === type),
  let noRequestView = <li className="transparent">Error.</li>;
  switch (type) {
    case requestEnum.REQUEST:
      noRequestView = <li className="transparent">No requests found.</li>;
      break;
    case requestEnum.INVITE:
      noRequestView = <li className="transparent">No invites found.</li>;
      break;
  }
  return (
    <div className="notifications-container">
      <ul className="notifications-list">
        {
          (requests.length == 0) ? noRequestView : 
          <div>
            {
              requests.map((request, key) => <Request request={request} key={key} />)
            }
            <li className="transparent center-align"><LoadMore /></li>
          </div>
      }
      </ul>
    </div>
  );
}

RequestList.propTypes = {
  requests: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  requests: state.users.user.requests
});

export default connect(mapStateToProps)(RequestList);
