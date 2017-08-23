import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { Counter } from "../../utilities";

const RequestCounter = ({ requests, type }) => {
  const count = requests.filter(request => request.type === type).length;
  return <Counter count={ count } />
};

RequestCounter.propTypes = {
  requests: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  requests: state.users.user.requests
});

export default connect(mapStateToProps)(RequestCounter);
