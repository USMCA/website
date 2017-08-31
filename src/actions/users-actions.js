import fetch from 'isomorphic-fetch';
import $ from 'jquery';

import auth from '../auth';
import { memberCompetitions } from './competitions-actions';
import {
  requestPayloads,
  requestStatuses,
  USER_INFO,
  USER_ADMIN,
  USER_COMP_RES
} from './types';
import { requestTypes } from '../../constants';
import { authenticate } from './utilities';

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
      fetch(`/api/users?${$.param({ id: userId })}`, { 
        method: 'get',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }).then(
        res => res.json().then(({ success, message, user }) => {
          if (!success) dispatch(Object.assign(action, errorPayload(message)));
          else dispatch(Object.assign(action, successPayload({ content: user })));
        }),
        err => dispatch(Object.assign(action, errorPayload(
          err.message || 'Failed to communicate with server.'
        )))
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
      err => dispatch(Object.assign(action, errorPayload(
        err.message || 'Failed to communicate with server.'
      )))
    );
  }
}

/* respond to a competition request */
export function respondCompetition(request, adminResponse) {
  let action = { type: USER_COMP_RES };
  return dispatch => {
    if (!auth.isAdmin()) {
      dispatch(Object.assign(action, errorPayload('User is not an admin.')));
    } else if ( adminResponse !== requestTypes.ACCEPT && 
                adminResponse !== requestTypes.REJECT ) {
      dispatch(Object.assign(action, errorPayload('Invalid response to request.')));
    } else {
      dispatch(Object.assign(action, pendingPayload()));
      fetch('/api/competitions', {
        method: 'post',
        body: JSON.stringify({
          requestId: request._id,
          type: adminResponse
        }),
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }).then(
        res => res.json().then(({ success, message }) => {
          if (!success) dispatch(Object.assign(action, errorPayload(message)));
          else dispatch(Object.assign(action, successPayload(requestId: request._id)));
        }),
        err => dispatch(Object.assign(action, errorPayload(
          err.message || 'Failed to communicate with server.'
        )))
      );
    }
  }
}

