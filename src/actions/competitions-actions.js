import fetch from 'isomorphic-fetch';
import $ from 'jquery';

import { 
  requestPayloads,
  COMP_REQ,
  COMP_RES,
  COMP_GET,
  COMP_FETCH_MINE,
  COMP_FETCH_DIR,
  requestStatuses
} from './types';
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

/*******************************************************************************
 * Synchronous actions.
 ******************************************************************************/

export function compErrorHandler(dispatch, errorMessage) {
  dispatch({ type: COMP_ERROR, payload: errorMessage });
}

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
        response => {
          return response.json()
          .then(({ success, message }) => {
            if (!success) dispatch(Object.assign(action, errorPayload(message)));
            else dispatch(Object.assign(action, submittedPayload()));
          });
        }, 
        error => {
          dispatch(Object.assign(action, errorPayload(
            error.message || 'Failed to communicate with server'
          )));
        }
      );
    }
  }
}

export function memberCompetitions() {
  let action = { type: COMP_FETCH_MINE };
  return dispatch => {
    const userId = auth.userId();
    if (!userId) {
      dispatch(Object.assign(action, errorPayload('User is not logged in.')));
    } else {
      dispatch(Object.assign(action, pendingPayload()));
      fetch('/api/users/competitions', {
        method: 'get',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }).then(
        response => {
          return response.json()
          .then(({ success, message, competitions }) => {
            if (!success) dispatch(Object.assign(action, errorPayload(message)));
            else dispatch(Object.assign(action, successPayload({ 
              content: competitions 
            })));
          });
        },
        error => {
          dispatch(Object.assign(action, errorPayload(
            error.message || 'Failed to communicate with server'
          )));
        }
      );
    }
  }
}

export function allCompetitions() {
  let action = { type: COMP_GET };
  return dispatch => {
    dispatch(Object.assign(action, pendingPayload()));
    fetch('/api/competitions', { method: 'get' })
    .then(
      response => {
        return response.json()
        .then(({ success, message, copmetitions }) => {
          if (!success) dispatch(Object.assign(action, errorPayload(message)));
          else dispatch(Object.assign(action, successPayload({ 
            content: competitions 
          })));
        });
      },
      error => {
        dispatch(Object.assign(action, errorPayload(
          error.message || 'Failed to communicate with server'
        )));
      }
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
        response => {
          return response.json()
          .then(({ success, message, competitions }) => {
            if (!success) dispatch(Object.assign(action, errorPayload(message)));
            else dispatch(Object.assign(action, successPayload({ 
              content: competitions 
            })));
          });
        },
        error => {
          dispatch(Object.assign(action, errorPayload(
            error.message || 'Failed to communicate with server'
          )));
        }
      );
    }
  }
}
