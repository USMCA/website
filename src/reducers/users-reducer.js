import _ from 'lodash';
import { 
  requestStatuses,
  USER_INFO,
  USER_ADMIN,
  USER_COMP_RES,
  USER_JOIN_RES,
  USER_PUT
} from '../actions/types';

const { SUCCESS, PENDING, SUBMITTED, IDLE, ERROR } = requestStatuses;
const INITIAL_STATE = { 
  user: { content: null, message: '', requestStatus: IDLE },
  admins: { content: [], message: '', requestStatus: IDLE }
};

export default function (state = INITIAL_STATE, { type, payload }) {  
  switch(type) {
    case USER_PUT:
    case USER_INFO:
      return { ...state, user: payload };
    case USER_ADMIN:
      return { ...state, admins: payload };
    case USER_JOIN_RES:
    case USER_COMP_RES:
      const { requestStatus, message } = payload;
      if (requestStatus !== SUCCESS)
        return { 
          ...state, 
          user: { requestStatus, message, content: Object.assign({}, state.user.content) }
        };
      const requests = _.filter(
        _.cloneDeep(state.user.content.requests), request => (
          request._id !== payload.requestId
        )
      );
      return { 
        ...state, 
        user: {
          requestStatus,
          message,
          content: Object.assign({}, state.user.content, { requests })
        }
      };
    default:
      return state;
  }
}
