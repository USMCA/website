import { 
  requestStatuses,
  PROB_ERROR,
  PROB_FETCH_MINE,
  PROB_POST,
  PROB_GET
} from '../actions/types';

const { SUCCESS, PENDING, SUBMITTED, IDLE } = requestStatuses;

const INITIAL_STATE = { 
  error: false, 
  message: '', 
  requestStatus: IDLE,
  myProposals: [], 
  proposal: {}
};

export default function (state = INITIAL_STATE, action) {  
  switch(action.type) {
    case PROB_ERROR:
      return { ...state, error: true, message: action.payload };
    case PROB_FETCH_MINE:
      switch(action.payload.requestStatus) {
        case SUCCESS:
          return {
            ...state,
            error: false,
            myProposals: action.payload.problems,
            requestStatus: SUCCESS
          };
        default:
          return {
            ...state,
            requestStatus: action.payload.requestStatus
          };
      }
    case PROB_POST: 
      return {
        ...state,
        requestStatus: action.payload.requestStatus
      };
    case PROB_GET:
      switch(action.payload.requestStatus) {
        case SUCCESS:
          return {
            ...state,
            error: false,
            proposal: action.payload.problem,
            requestStatus: SUCCESS
          };
        default:
          return {
            ...state,
            requestStatus: action.payload.requestStatus
          };
      }
    default:
      return state;
  }
}
