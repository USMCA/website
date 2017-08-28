import { 
  requestStatuses,
  PROB_FETCH_MINE,
  PROB_POST,
  PROB_GET
} from '../actions/types';

const { SUCCESS, PENDING, SUBMITTED, IDLE, ERROR } = requestStatuses;

const INITIAL_STATE = { 
  postProposal: { requestStatus: IDLE, message: '' },
  myProposals: { content: [], requestStatus: IDLE, message: '' }, 
  proposal: { content: null, requestStatus: IDLE, message: '' }
};

export default function (state = INITIAL_STATE, { type, payload }) {  
  switch(type) {
    case PROB_FETCH_MINE:
      return { ...state, myProposals: payload };
    case PROB_POST: 
      return { ...state, postProposal: payload };
    case PROB_GET:
      return { ...state, proposal: payload };
    default:
      return state;
  }
}
