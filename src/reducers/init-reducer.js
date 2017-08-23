import { 
  requestStatuses,
  INIT_ERROR,
  INIT_APP
} from '../actions/types';

const INITIAL_STATE = { 
  error: false, 
  message: '', 
  user: {},
  requestStatus: requestStatuses.IDLE
};

export default function (state = INITIAL_STATE, action) {  
  switch(action.type) {
    case INIT_APP:
      switch (action.payload.requestStatus) {
        case (requestStatuses.SUCCESS):
          return {
            ...state,
            error: false,
            message: '',
          }
        default:
          return state;
      }
    default:
      return state;
  }
}
