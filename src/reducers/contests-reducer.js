import { 
  CONTEST_POST,
  CONTEST_GET,
  requestStatuses
} from '../actions/types';

const { SUCCESS, PENDING, SUBMITTED, IDLE, ERROR } = requestStatuses;
const INITIAL_STATE = { 
  createContest: { content: null, message: '', requestStatus: IDLE },
  contest: { content: null, message: '', requestStatus: IDLE }
};

export default function (state = INITIAL_STATE, { type, payload }) {  
  switch(type) {
    case CONTEST_POST:
      return { ...state, createContest: payload };
    case CONTEST_GET:
      return { ...state, contest: payload };
    default:
      return state;
  }
}
