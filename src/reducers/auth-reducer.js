import { 
  requestStatuses,
  AUTH_USER,
  UNAUTH_USER,
  CHANGE_PASS
} from '../actions/types';

const { SUCCESS, PENDING, SUBMITTED, IDLE, ERROR } = requestStatuses;

const INITIAL_STATE = { 
  authenticated: { content: null, requestStatus: IDLE, message: '' },
  changePassword: { content: null, requestStatus: IDLE, message: '' }
};

export default function (state = INITIAL_STATE, { type, payload }) {  
  switch(type) {
    case CHANGE_PASS:
      return { ...state, changePassword: payload };
    case AUTH_USER:
    case UNAUTH_USER:
      return { ...state, authenticated: payload };
    default:
      return state;
  }
}
