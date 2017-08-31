import { 
  CONTEST_POST,
  requestStatuses
} from '../actions/types';

const { SUCCESS, PENDING, SUBMITTED, IDLE, ERROR } = requestStatuses;
const INITIAL_STATE = { 
  createContest: { content: null, message: '', requestStatus: IDLE }
};

export default function (state = INITIAL_STATE, { type, payload }) {  
  switch(type) {
    case CONTEST_POST:
      return { ...state, createContest: payload };
    default:
      return state;
  }
}
