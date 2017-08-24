/* initialization */
export const INIT_ERROR = 'init_error', // notify initialization error
             INIT_USER = 'init_user', // fetch user initialization data from server
             INIT_APP = 'init_app'; // fetch initialization data from server

export const requestStatuses = {
  SUCESS: 'success',
  PENDING: 'pending',
  SUBMITTED: 'submitted',
  IDLE: 'idle'
};

/* authorization */
export const AUTH_USER = 'auth_user', // set user to be authenticated
             UNAUTH_USER = 'unauth_user', // set user to be unauthenticated
             AUTH_ERROR = 'auth_error'; // notify an authentication error

/* authorization */
export const USER_ERROR = 'user_error', // notifiy user data error
             USER_INFO = 'user_info', // get user info
             USER_ADMIN = 'user_admin', // get admins
             USER_COMP_RES = 'comp_res'; // respond to create competition

/* competitions */
export const COMP_ERROR = 'comp_error', // notify a competition error
             COMP_REQ = 'comp_req', // request to create competition
             COMP_GET = 'comp_get', // get all competitions
             COMP_FETCH_MINE = 'comp_fetch_mine'; // get user competition info

/* problem proposals */
export const PROB_ERROR = 'prob_error', // notify a proposal error
             PROB_FETCH_MINE = 'prob_fetch_mine', // fetch proposals written by user
             PROB_POST = 'prob_post', // post a proposal
             PROB_GET = 'prob_get';
