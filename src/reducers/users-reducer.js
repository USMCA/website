import _ from 'lodash';
import { 
  requestStatuses,
  USER_INFO,
  USER_ADMIN,
  USER_COMP_RES
} from '../actions/types';

const { SUCCESS, PENDING, SUBMITTED, IDLE } = requestStatuses;
const INITIAL_STATE = { 
  user: { content: null, message: '', requestStatus: IDLE },
  admins: { content: [], message: '', requestStatus: IDLE }
};

export default function (state = INITIAL_STATE, { type, payload }) {  
  switch(type) {
    case USER_INFO:
      return { ...state, user: payload };
    case USER_ADMIN:
      return { ...state, admins: payload };
    case USER_COMP_RES:
      const requests = _.filter(state.user.content.requests, request => (
        request._id !== payload.requestId
      ));
      return { ...state, user: Object.assign(state.user.content, { requests }) }
    default:
      return state;
  }
}
