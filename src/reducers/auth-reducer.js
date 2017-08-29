import { 
  requestStatuses,
  AUTH_USER,
  UNAUTH_USER
} from '../actions/types';

const { SUCCESS, PENDING, SUBMITTED, IDLE, ERROR } = requestStatuses;

const INITIAL_STATE = { 
  authenticated: { content: null, requestStatus: IDLE, message: '' }
};

export default function (state = INITIAL_STATE, { type, payload }) {  
  switch(type) {
    case AUTH_USER:
    case UNAUTH_USER:
      return { ...state, authenticated: payload };
    default:
      return state;
  }
}
