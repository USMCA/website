import { 
  CONTEST_ERROR,
  CONTEST_POST,
  requestStatuses
} from '../actions/types';

const { SUCCESS, PENDING, SUBMITTED, IDLE } = requestStatuses;
const INITIAL_STATE = { 
  error: false, 
  message: '', 
  requestStatus: IDLE
};

export default function (state = INITIAL_STATE, action) {  
  switch(action.type) {
    case CONTEST_ERROR:
      return { ...state, error: true, message: action.payload };
    case CONTEST_POST:
      return { 
        ...state, 
        error: false, 
        requestStatus: action.payload.requestStatus 
      };
    default:
      return state;
  }
}
