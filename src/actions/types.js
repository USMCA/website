/* initialization */
export const INIT_ERROR = 'init_error', // notify initialization error
             INIT_USER = 'init_user', // fetch user initialization data from server
             INIT_APP = 'init_app'; // fetch initialization data from server

export const requestStatuses = {
  SUCCESS: 'success',
  PENDING: 'pending',
  SUBMITTED: 'submitted', IDLE: 'idle',
  ERROR: 'error'
};

export const requestPayloads = {
  errorPayload: errorMessage => ({
    payload: {
      requestStatus: requestStatuses.ERROR,
      message: errorMessage
    }
  }),
  pendingPayload: () => ({
    payload: {
      requestStatus: requestStatuses.PENDING
    }
  }),
  idlePayload: () => ({
    payload: {
      requestStatus: requestStatuses.IDLE
    }
  }),
  successPayload: (state = {}) => ({
    payload: {
      requestStatus: requestStatuses.SUCCESS,
      ...state
    }
  }),
  submittedPayload: (state = {}) => ({
    payload: {
      requestStatus: requestStatuses.SUBMITTED,
      ...state
    }
  })
};

/* authorization */
export const AUTH_USER = 'auth_user', // set user to be authenticated
             UNAUTH_USER = 'unauth_user', // set user to be unauthenticated
             CHANGE_PASS = 'change_pass'; // change user password

/* authorization */
export const USER_INFO = 'user_info', // get user info
             USER_ADMIN = 'user_admin', // get admins
             USER_COMP_RES = 'comp_res', // respond to create competition
             USER_JOIN_RES = 'user_join_res', // respond to join competition
             USER_NOTIF_TOGGLE = 'notif_toggle', // toggle between unread, read, and urgent
             USER_PUT = 'user_put'; // generic put request

/* competitions */
export const COMP_REQ = 'comp_req', // request to create competition
             COMP_GET = 'comp_get', // get all competitions
             COMP_FETCH_MINE = 'comp_fetch_mine', // get user competition info
             COMP_FETCH_DIR = 'comp_fetch_dir', // get user competition info
             COMP_REQ_JOIN = 'comp_req_join'; // request to join competition

/* contests */
export const CONTEST_POST = 'contest_post', // post a contest
             CONTEST_GET = 'contest_get', // get a contest
             CONTEST_TEST_POST = 'contest_test_post'; // post a test

/* problem proposals */
export const PROB_FETCH_MINE = 'prob_fetch_mine', // fetch proposals written by user
             PROB_POST = 'prob_post', // post a proposal
             PROB_GET = 'prob_get', // get a proposal by id
             PROB_UPVOTE = 'prob_upvote', // upvote a problem
             PROB_COMMENT = 'prob_comment', // comment on a problem
             PROB_DATABASE = 'prob_database', // fetch database of a competition
             PROB_PUBLIC_DATABASE = 'prob_public_database', // fetch public database
             PROB_TAKE = 'prob_take', // take problem from shared database
             PROB_TEST_SOLVE = 'prob_test_solve', // post a test solve
             PROB_PROB_COMMENT = 'prob_prob_coment', // comment on a problem
             PROB_SOLN_COMMENT = 'prob_soln_comment'; // comment on a solution
