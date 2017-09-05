import { 
  CONTEST_POST,
  CONTEST_GET,
  CONTEST_TEST_POST,
  CONTEST_TEST_GET,
  CONTEST_TEST_PROB,
  requestStatuses
} from '../actions/types';

const { SUCCESS, PENDING, SUBMITTED, IDLE, ERROR } = requestStatuses;
const INITIAL_STATE = { 
  createContest: { content: null, message: '', requestStatus: IDLE },
  contest: { content: null, message: '', requestStatus: IDLE },
  postTestData: { requestStatus: IDLE, message: '' },
  test: { content: null, message: '', requestStatue: IDLE },
  addTestProb: { message: '', requestStatue: IDLE }
};

export default function (state = INITIAL_STATE, { type, payload }) {
  if (!payload) return state;
  const { content, requestStatus, message } = payload;
  switch(type) {
    case CONTEST_POST:
      return { ...state, createContest: payload };
    case CONTEST_GET:
      return { ...state, contest: payload };
    case CONTEST_TEST_POST:
      const test = content;
      return { 
        ...state,
        postTestData: { requestStatus, message },
        contest: {
          requestStatus,
          message,
          content: (requestStatus === SUCCESS) ? (
            Object.assign({}, state.contest.content, {
              tests: state.contest.content.tests.concat(test)
            })
          ) : ( state.contest.content )
        }
      };
    case CONTEST_TEST_GET:
      return { ...state, test: payload };
    case CONTEST_TEST_PROB:
      const problem = content;
      let newState = { 
        ...state, 
        contest: Object.assign({}, state.contest, { requestStatus, message }),
        addTestProb: { requestStatus, message }
      };
      if (requestStatus === SUCCESS) newState.test.content.problems.push(problem);
      return newState;
    default:
      return state;
  }
}
