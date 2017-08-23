import fetch from 'isomorphic-fetch';
import $ from 'jquery';

import auth from '../auth';
import { userInfo, adminInfo } from './users-actions';
import {
  requestStatuses,
  INIT_ERROR,
  INIT_USER,
  INIT_APP
} from './types';

/*******************************************************************************
 * Synchronous actions.
 ******************************************************************************/

export function initErrorHandler(dispatch, errorMessage) {
  dispatch({ type: INIT_ERROR, payload: errorMessage});
}

/*******************************************************************************
 * Async thunk actions.
 ******************************************************************************/
export function initApp() {
  return dispatch => {
    userInfo()(dispatch);
    adminInfo()(dispatch);
  }
}
