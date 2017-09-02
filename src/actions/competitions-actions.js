import fetch from 'isomorphic-fetch';
import $ from 'jquery';

import { 
  requestPayloads,
  COMP_REQ,
  COMP_RES,
  COMP_GET,
  COMP_FETCH_MINE,
  COMP_FETCH_DIR,
  COMP_REQ_JOIN,
  requestStatuses
} from './types';
import { requestTypes } from '../../constants';
import auth from '../auth';
import { authenticate } from './utilities';

const { SUCCESS, PENDING, SUBMITTED, IDLE, ERROR } = requestStatuses;
const {
  successPayload,
  pendingPayload,
  errorPayload,
  idlePayload,
  submittedPayload
} = requestPayloads;

/*******************************************************************************
 * Async thunk actions.
 ******************************************************************************/

export function requestCompetition({ name, shortName, website }) {
  let action = { type: COMP_REQ };
  return dispatch => {
    const userId = auth.userId();
    if (!userId) {
      dispatch(Object.assign(action, errorPayload('User is not logged in.')));
    } else {
      dispatch(Object.assign(action, pendingPayload()));
      fetch('/api/competitions', {
        method: 'post',
        body: JSON.stringify({ 
          type: requestTypes.REQUEST, 
          competition: {
            name, shortName, website 
          },
          userId: userId //@TODO remove this
        }),
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(
        res => res.json().then(({ success, message }) => {
          if (!success) dispatch(Object.assign(action, errorPayload(message)));
          else dispatch(Object.assign(action, submittedPayload()));
        }),
        err => dispatch(Object.assign(action, errorPayload(
          error.message || 'Failed to communicate with server'
        ))),
      );
    }
  }
}

export function memberCompetitions(options = { info: false }) {
  let action = { type: COMP_FETCH_MINE };
  const { info } = options;
  return dispatch => {
    authenticate(action, dispatch, userId => {
      dispatch(Object.assign(action, pendingPayload()));
      const url = `/api/users/competitions?${$.param({info})}`;
      fetch(url, {
        method: 'get',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }).then(
        res => res.json().then(({ success, message, competitions }) => {
            if (!success) dispatch(Object.assign(action, errorPayload(message)));
            else dispatch(Object.assign(action, successPayload({ 
              content: competitions 
            })));
        }),
        err => dispatch(Object.assign(action, errorPayload(
          error.message || 'Failed to communicate with server'
        )))
      );
    });
  }
}

export function allCompetitions() {
  let action = { type: COMP_GET };
  return dispatch => {
    dispatch(Object.assign(action, pendingPayload()));
    fetch('/api/competitions', { method: 'get' })
    .then(
      res => res.json().then(({ success, message, competitions }) => {
        if (!success) dispatch(Object.assign(action, errorPayload(message)));
        else dispatch(Object.assign(action, successPayload({ 
          content: competitions 
        })));
      }),
      err => dispatch(Object.assign(action, errorPayload(
        err.message || 'Failed to communicate with server'
      )))
    );
  }
}

export function directorCompetitions() {
  let action = { type: COMP_FETCH_DIR };
  return dispatch => {
    const userId = auth.userId();
    if (!userId) {
      dispatch(Object.assign(action, errorPayload('User is not logged in.')));
    } else {
      dispatch(Object.assign(action, pendingPayload()));
      fetch('/api/users/director', {
        method: 'get',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }).then(
        res => res.json().then(({ success, message, competitions }) => {
          if (!success) dispatch(Object.assign(action, errorPayload(message)));
          else dispatch(Object.assign(action, successPayload({ 
            content: competitions 
          })));
        }),
        err => dispatch(Object.assign(action, errorPayload(
          err.message || 'Failed to communicate with server.'
        )))
      );
    }
  }
}

export function joinCompetition(competition_id) {
  let action = { type: COMP_REQ_JOIN };
  return dispatch => {
    authenticate(action, dispatch, userId => {
      dispatch(Object.assign(action, pendingPayload()));
      fetch('/api/competitions/join', {
        method: 'post',
        body: JSON.stringify({ type: requestTypes.REQUEST, competition_id }),
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }).then(
        response => response.json().then(({ success, message }) => {
          if (!success) dispatch(Object.assign(action, errorPayload(message)));
          else dispatch(Object.assign(action, successPayload()));
        }),
        err => dispatch(Object.assign(action, errorPayload(
          err.message || 'Failed to communicate with server.'
        )))
      );
    });    
  }
}
