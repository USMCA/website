import { 
  COMP_ERROR,
  COMP_REQ,
  COMP_FETCH_MINE,
  requestStatuses
} from '../actions/types';

const { SUCCESS, PENDING, SUBMITTED, IDLE } = requestStatuses;
const INITIAL_STATE = { 
  error: false, 
  message: '', 
  requestStatus: IDLE,
  myCompetitions: []
};

export default function (state = INITIAL_STATE, action) {  
  switch(action.type) {
    case COMP_ERROR:
      return { ...state, error: true, message: action.payload };
    case COMP_REQ:
      return { 
        ...state, 
        error: false, 
        message: '', 
        requestStatus: action.payload.requestStatus 
      };
    case COMP_FETCH_MINE:
      switch (action.payload.requestStatus) {
        case SUCCESS:
          return {
            ...state,
            error: false,
            myCompetitions: action.payload.competitions
          };
        default: 
          return state;
      }
    default:
      return state;
  }
}
