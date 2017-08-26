import { 
  PROB_ERROR,
  PROB_FETCH_MINE,
  PROB_POST,
  PROB_GET,
  requestStatuses
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
    case PROB_FETCH_MINE:
      switch(action.payload.requestStatus) {
        case SUCCESS:
          console.log('ailee received', action.payload.problems);
          return {
            ...state,
            error: false,
            myProposals: action.payload.problems
          };
        default:
          return state;
      }
    case PROB_POST: 
    default:
      return state;
  }
}
