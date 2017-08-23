import { 
  PROB_ERROR,
  PROB_FETCH_MINE,
  PROB_POST,
  PROB_GET
} from '../actions/types';

const INITIAL_STATE = { 
  error: false, 
  message: '', 
  proposalsLoading: false,
  proposalSubmitting: false,
  myProposals: [], 
  proposal: {}
};

export default function (state = INITIAL_STATE, action) {  
  switch(action.type) {
    case PROB_ERROR:
    case PROB_FETCH_MINE:
    case PROB_POST: 
    default:
      return state;
  }
}
