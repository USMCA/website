import {
  requestStatuses,
  PROB_FETCH_MINE,
  PROB_POST,
  PROB_GET,
  PROB_UPVOTE,
  PROB_DATABASE,
  PROB_TEST_SOLVE,
  PROB_PUT
} from '../actions/types';

const { SUCCESS, PENDING, SUBMITTED, IDLE, ERROR } = requestStatuses;

const INITIAL_STATE = {
  postProposal: { requestStatus: IDLE, message: '' },
  myProposals: { content: [], requestStatus: IDLE, message: '' },
  proposal: { content: null, requestStatus: IDLE, message: '' },
  database: { content: [], requestStatus: IDLE, message: '' }
};

export default function (state = INITIAL_STATE, { type, payload }) {
  switch(type) {
    case PROB_FETCH_MINE:
      return { ...state, myProposals: payload };
    case PROB_POST:
      return { ...state, postProposal: payload };
    case PROB_PUT:
    case PROB_UPVOTE:
    case PROB_GET:
      return { ...state, proposal: payload };
    case PROB_TEST_SOLVE:
      const { requestStatus, message, content } = payload, 
            newState = (requestStatus !== SUCCESS) ? { 
              ...state,
              proposal: Object.assign({}, state.proposal, {
                requestStatus, message 
              })
            } : { 
              ...state, 
              proposal: {
                requestStatus, 
                message, 
                content: Object.assign({}, state.proposal.content, { 
                  alternate_soln: content 
                })
              }
            };
      return newState;
    case PROB_DATABASE:
      return { ...state, database: payload };
    default:
      return state;
  }
}
