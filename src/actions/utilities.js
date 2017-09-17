import fetch from 'isomorphic-fetch';
import * as $ from 'jquery';

import { requestPayloads, requestStatuses } from './types';
import { requestTypes } from '../../constants';
import auth from '../auth';

const { SUCCESS, PENDING, SUBMITTED, IDLE, ERROR } = requestStatuses;
const {
  successPayload,
  pendingPayload,
  errorPayload,
  idlePayload,
  submittedPayload
} = requestPayloads;

export function authenticate(action, dispatch, callback) {
  const userId = auth.userId(); 
  if (!userId) {
    dispatch(Object.assign(action, errorPayload('User is not logged in.')));
  } else callback(userId);
}

export function serverError(action, dispatch) {
  return err => dispatch(Object.assign(action, errorPayload(
    err.message || 'Failed to communicate with server.'
  )));
}

export function APIAction({ type, url, opts, formatData }) {
  let action = { type };
  return dispatch => {
    dispatch(Object.assign(action, pendingPayload()));
    fetch(url, opts).then(
      res => res.json().then(data => {
        const { success, message, content } = formatData(data);
        if (!success) dispatch(Object.assign(action, errorPayload(message)));
        else dispatch(Object.assign(action, successPayload({ content })));
      }),
      serverError(action, dispatch)
    ); 
  }
}

export function authAPIAction({ type, url, opts, formatData, noPending }) {
  let action = { type };
  return dispatch => {
    authenticate(action, dispatch, userId => {
      if (!noPending) dispatch(Object.assign(action, pendingPayload()));
      fetch(url, opts).then(
        res => res.json().then(data => {
          const { success, message, content } = formatData(data);
          if (!success) dispatch(Object.assign(action, errorPayload(message)));
          else dispatch(Object.assign(action, successPayload({ content })));
        }),
        serverError(action, dispatch)
      ); 
    });
  }
}

