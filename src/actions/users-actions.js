import fetch from 'isomorphic-fetch';
import $ from 'jquery';

import auth from '../auth';
import { memberCompetitions } from './competitions-actions';
import {
  requestPayloads,
  requestStatuses,
  USER_INFO,
  USER_ADMIN,
  USER_COMP_RES,
  USER_JOIN_RES,
  USER_PUT,
  USER_TS
} from './types';
import { requestTypes } from '../../constants';
import { authenticate, serverError, APIAction, authAPIAction } from './utilities';

const {
  successPayload,
  errorPayload,
  pendingPayload,
  idlePayload
} = requestPayloads;
const { SUCCESS, PENDING, SUBMITTED, IDLE, ERROR } = requestStatuses;

/* fetch user info */
export function userInfo() {
  let action = { type: USER_INFO };
  return dispatch => {
    authenticate(action, dispatch, userId => {
      dispatch(Object.assign(action, pendingPayload()));
      fetch('/api/users', { 
        method: 'get',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      }).then(
        res => res.json().then(({ success, message, user }) => {
          if (!success) dispatch(Object.assign(action, errorPayload(message)));
          else dispatch(Object.assign(action, successPayload({ content: user })));
        }),
        serverError(action, dispatch)
      );
    });
  }
}

/* fetch admin info */
export function adminInfo() {
  let action = { type: USER_ADMIN };
  return dispatch => {
    dispatch(Object.assign(action, pendingPayload()));
    fetch('/api/users/admin', { method: 'get' }).then(
      res => res.json().then(({ success, message, admins }) => {
        if (!success) dispatch(Object.assign(action, errorPayload(message)));
        else dispatch(Object.assign(action, successPayload({ content: admins })));
      }),
      serverError(action, dispatch)
    );
  }
}

const requestURLs = {
  [USER_COMP_RES]: '/api/competitions',
  [USER_JOIN_RES]: '/api/competitions/join'
};

/* respond to a request */
export function respondRequest(request, response, type) {
  let action = { type };
  return dispatch => {
    if (response !== requestTypes.ACCEPT && 
        response !== requestTypes.REJECT ) {
      dispatch(Object.assign(action, errorPayload('Invalid response to request.')));
    } else {
      dispatch(Object.assign(action, pendingPayload()));
      fetch(requestURLs[type], {
        method: 'post',
        body: JSON.stringify({ requestId: request._id, type: response }),
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }).then(
        res => res.json().then(({ success, message }) => {
          if (!success) dispatch(Object.assign(action, errorPayload(message)));
          else dispatch(Object.assign(action, successPayload({
            requestId: request._id
          })));
        }),
        serverError(action, dispatch)
      );
    }
  }
}

export function userPut(query) {
  let action = { type: USER_PUT };
  return dispatch => {
    authenticate(action, dispatch, userId => {
      dispatch(Object.assign(action, pendingPayload()));
      fetch('/api/users', {
        method: 'put',
        body: JSON.stringify(query),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }).then(
        res => res.json().then(({ success, message, user }) => {
          if (!success) dispatch(Object.assign(action, errorPayload(message)));
          else dispatch(Object.assign(action, successPayload({ content: user })));
        }),
        serverError(action, dispatch)
      ); 
    });
  }
}

export function userTS() {
  return authAPIAction({
    type: USER_TS,
    url: '/api/users/test-solving',
    opts: {
      method: 'get',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    },
    formatData: ({ success, message, general, user }) => ({
      success, message, content: { general, user }
    })
  });
}
