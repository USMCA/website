import {
  requestStatuses,
  PROB_FETCH_MINE,
  PROB_POST,
  PROB_GET,
  PROB_UPVOTE,
  PROB_DATABASE,
  PROB_PUBLIC_DATABASE,
  PROB_TAKE,
  PROB_TEST_SOLVE,
  PROB_PROB_COMMENT,
  PROB_SOLN_COMMENT
} from '../actions/types';

const { SUCCESS, PENDING, SUBMITTED, IDLE, ERROR } = requestStatuses;

const INITIAL_STATE = {
  postProposal: { requestStatus: IDLE, message: '' },
  myProposals: { content: [], requestStatus: IDLE, message: '' },
  proposal: { content: null, requestStatus: IDLE, message: '' },
  database: { content: [], requestStatus: IDLE, message: '' },
  publicDatabase: { content: [], requestStatus: IDLE, message: '' }
};

export default function (state = INITIAL_STATE, { type, payload }) {
  const { content, requestStatus, message } = payload ? payload : {};
  switch(type) {
    case PROB_FETCH_MINE:
      return { ...state, myProposals: payload };
    case PROB_POST:
      return { ...state, postProposal: payload };
    case PROB_UPVOTE:
    case PROB_GET:
      return { ...state, proposal: payload };
    case PROB_SOLN_COMMENT:
    case PROB_TEST_SOLVE:
      return (requestStatus !== SUCCESS) ? { 
        ...state,
        proposal: Object.assign({}, state.proposal, { requestStatus, message })
      } : { 
        ...state, 
        proposal: {
          requestStatus, 
          message, 
          content: Object.assign({}, state.proposal.content, { alternate_soln: content })
        }
      };
    case PROB_PROB_COMMENT:
      return (requestStatus !== SUCCESS) ? { 
        ...state,
        proposal: Object.assign({}, state.proposal, { requestStatus, message })
      } : { 
        ...state, 
        proposal: {
          requestStatus, 
          message, 
          content: Object.assign({}, state.proposal.content, { comments: content  })
        }
      };
    case PROB_DATABASE:
      return { ...state, database: payload };
    case PROB_PUBLIC_DATABASE:
      return { ...state, publicDatabase: payload };
    case PROB_TAKE: 
      return (requestStatus !== SUCCESS) ? { 
        ...state,
        publicDatabase: Object.assign({}, state.publicDatabase, { requestStatus, message })
      } : { 
        ...state, 
        publicDatabase: {
          requestStatus, 
          message, 
          content: state.publicDatabase.content.filter(prob => prob._id !== content._id)
        }
      };
    default:
      return state;
  }
}
