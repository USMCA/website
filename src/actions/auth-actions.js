import fetch from 'isomorphic-fetch';

import { userInfo } from './users-actions';
import { 
  AUTH_USER,  
  UNAUTH_USER, 
  requestPayloads
} from './types';

const { 
  errorPayload, 
  pendingPayload,
  idlePayload,
  successPayload
} = requestPayloads;

export function logoutUser(dispatch) {
  localStorage.removeItem('token');
  dispatch({ 
    type: UNAUTH_USER, 
      payload: { 
      content: null, 
      requestStatus: SUCCESS 
    } 
  });
}

const handleAuth = (action, dispatch) => {
  return response => {
    return response.json()
    .then(({ success, message, token, user }) => {
      if (!success) dispatch(Object.assign(action, errorPayload(message)));
      else {
        const content = user || {}; // ensure that user is defined
        localStorage.setItem('token', token);
        dispatch(Object.assign(action, successPayload({ content })));
        userInfo()(dispatch);
      }
    });
  }
}

export function loginUser({ email, password }) {
  let action = { type: AUTH_USER };
  return dispatch => {
    fetch('/login', {
      method: 'post',
      body: JSON.stringify({ email, password }),
      headers: { 'Content-Type': 'application/json' }
    })
    .then(handleAuth(action, dispatch), ({ message }) => {
      dispatch(Object.assign(action, errorPayload(
        message || 'Failed to communicate with server.'
      )));
    });
  }
}

export function signupUser({ name, email, password, university }) {
  let action = { type: AUTH_USER };
  return dispatch => {
    fetch('/signup', {
      method: 'post',
      body: JSON.stringify({ name, email, password, university }),
      headers: { 'Content-Type': 'application/json' }
    })
    .then(handleAuth(action, dispatch), ({ message }) => {
      dispatch(Object.assign(action, errorPayload(
        message || 'Failed to communicate with server.'
      )));
    });
  }
}


