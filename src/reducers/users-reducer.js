import _ from 'lodash';
import { 
  requestStatuses,
  USER_ERROR,
  USER_INFO,
  USER_ADMIN,
  USER_COMP_RES
} from '../actions/types';

const { SUCCESS, PENDING, SUBMITTED, IDLE } = requestStatuses;
const INITIAL_STATE = { 
  error: false, 
  message: '', 
  user: {
    unread: [],
    read: [],
    urgent: [],
    requests: []
  },
  admins: [],
  requestStatus: IDLE
};

export default function (state = INITIAL_STATE, action) {  
  switch(action.type) {
    case USER_INFO:
      switch (action.payload.requestStatus) {
        case SUCCESS:
          console.log(action.payload.user);
          return {
            ...state,
            error: false,
            message: '',
            user: action.payload.user
          }
        default:
          return state;
      }
    case USER_ADMIN:
      switch (action.payload.requestStatus) {
        case SUCCESS:
          return {
            ...state,
            error: false,
            message: '',
            admins: action.payload.admins
          };
        default:
          return state;
      }
    case USER_COMP_RES:
      switch (action.payload.requestStatus) {
        case SUCCESS:
          console.log('we have succeeded');
          console.log(state);
          const newState = {
            ...state,
            error: false,
            message: '',
            user: Object.assign(state.user, {
              requests: _.remove(state.user.requests, request => (
                request._id !== action.payload.requestId
              ))
            })
          }
          console.log(newState);
          return newState;
        default:
          return state;
      }
    default:
      return state;
  }
}
