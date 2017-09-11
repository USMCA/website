import { 
  COMP_REQ,
  COMP_GET,
  COMP_FETCH_DIR,
  COMP_FETCH_MINE,
  COMP_REQ_JOIN,
  COMP_INV_JOIN,
  requestStatuses
} from '../actions/types';

const { SUCCESS, PENDING, SUBMITTED, IDLE, ERROR } = requestStatuses;
const INITIAL_STATE = { 
  requestCompetition: { message: '', requestStatus: IDLE },
  allCompetitions: { content: [], message: '', requestStatus: IDLE },
  memberCompetitions: { content: [], message: '', requestStatus: IDLE },
  directorCompetitions: { content: [], message: '', requestStatus: IDLE },
  joinCompetition: { content: null, message: '', requestStatus: IDLE },
  inviteCompetition: { content: null, message: '', requestStatus: IDLE }
};

export default function (state = INITIAL_STATE, { type, payload }) {  
  switch(type) {
    case COMP_REQ:
      return { ...state, requestCompetition: payload };
    case COMP_GET:
      return { ...state, allCompetitions: payload };
    case COMP_FETCH_MINE:
      return { ...state, memberCompetitions: payload };
    case COMP_FETCH_DIR:
      return { ...state, directorCompetitions: payload };
    case COMP_REQ_JOIN:
      return { ...state, joinCompetition: payload };
    case COMP_INV_JOIN:
      return { ...state, inviteCompetition: payload };
    default:
      return state;
  }
}
