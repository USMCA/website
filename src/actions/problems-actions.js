import fetch from 'isomorphic-fetch';
import $ from 'jquery';

import {
  requestPayloads,
  PROB_FETCH_MINE,
  PROB_POST,
  PROB_GET,
  PROB_UPVOTE,
  PROB_COMMENT,
  PROB_DATABASE
} from './types';
import auth from '../auth';
import { authenticate, serverError } from './utilities';

const {
  errorPayload,
  pendingPayload,
  idlePayload,
  successPayload
} = requestPayloads;

/*******************************************************************************
 * Async thunk actions.
 ******************************************************************************/

export function fetchMyProposals() {
  let action = { type: PROB_FETCH_MINE };
  return dispatch => {
    const userId = auth.userId();
    if (!userId) {
      dispatch(Object.assign(action, errorPayload('User is not logged in')));
    } else {
      dispatch(Object.assign(action, pendingPayload()));
      fetch('/api/users/problems', {
        method: 'get',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(
        response => {
          return response.json()
          .then(({ success, message, problems }) => {
            if (!success) dispatch(Object.assign(action, errorPayload(message)));
            else dispatch(Object.assign(action, successPayload({
              content: problems
            })));
          });
        },
        error => {
          dispatch(Object.assign(action, errorPayload(
            error.message || 'Failed to communicate with server.'
          )));
        }
      );
    }
  }
}

export function postProposal({
    competition_id, subject, difficulty, statement, answer, solution
  }) {
  let action = { type: PROB_POST };
  return dispatch => {
    dispatch(Object.assign(action, pendingPayload()));
    fetch('/api/users/problems', {
      method: 'post',
      body: JSON.stringify({
        competition_id, subject, difficulty, statement, answer, solution
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
          else dispatch(Object.assign(action, successPayload()));
        });
      },
      error => {
        dispatch(Object.assign(action, errorPayload(
          error.message || 'Failed to communicate with server.'
        )));
      }
    );
  }
}

export function getProposal(id) {
  let action = { type: PROB_GET };
  return dispatch => {
    const userId = auth.userId();
    if (!userId) {
      dispatch(Object.assign(action, errorPayload('User is not logged in.')));
    } else {
      dispatch(Object.assign(action, pendingPayload()));
      fetch(`/api/problems?${$.param({ id: id })}`, {
        method: 'get',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(
        res => res.json().then(({ success, message, problem }) => {
          if (!success) {
            dispatch(Object.assign(action, errorPayload(message)));
          } else {
            dispatch(Object.assign(action, successPayload({
              content: problem
            })));
          }
        }),
        serverError(action, dispatch)
      );
    }
  }
}

export function upvoteProblem(id) {
  let action = { type: PROB_UPVOTE };
  return dispatch => {
    authenticate(action, dispatch, userId => {
      fetch('api/problems/upvotes', {
        method: 'post',
        body: JSON.stringify({ id }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }).then(
        res => res.json().then(({ success, message, problem }) => {
          if (!success) {
            dispatch(Object.assign(action, errorPayload(message)));
          } else {
            dispatch(Object.assign(action, successPayload({
              content: problem
            })));
          }
        }),
        serverError(action, dispatch)
      );
    });
  }
}

export function fetchDatabase(id) {
  let action = { type: PROB_DATABASE };
  return dispatch => {
    authenticate(action, dispatch, userId => {
      dispatch(Object.assign(action, pendingPayload()));
      fetch(`api/competitions/database?${$.param({ id })}`, {
        method: 'get',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      }).then(
        res => res.json().then(({ success, message, problems }) => {
          if (!success) {
            dispatch(Object.assign(action, errorPayload(message)));
          } else {
            dispatch(Object.assign(action, successPayload({
              content: problems
            })));
          }
        }),
        serverError(action, dispatch)
      );
    });
  };
}
