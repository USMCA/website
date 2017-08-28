import fetch from 'isomorphic-fetch';
import $ from 'jquery';

import {
  requestStatuses,
  PROB_ERROR,
  PROB_FETCH_MINE,
  PROB_POST,
  PROB_GET
} from './types';
import auth from '../auth';

const { SUCCESS, PENDING, SUBMITTED, IDLE } = requestStatuses;

/*******************************************************************************
 * Synchronous actions.
 ******************************************************************************/

export function probErrorHandler(dispatch, errorMessage) {
  dispatch({
    type: PROB_ERROR,
    payload: errorMessage
  });
}

export function resetProposalForm(dispatch) {
  dispatch({
    type: PROB_POST,
    payload: { requestStatus: IDLE }
  });
}

/*******************************************************************************
 * Async thunk actions.
 ******************************************************************************/

export function fetchMyProposals() {
  return dispatch => {
    const userId = auth.userId();
    if (!userId) {
      return probErrorHandler(dispatch, 'User is not logged in.');
    } else {
      dispatch({ 
        type: PROB_FETCH_MINE, 
        payload: { requestStatus: PENDING }
      });
      fetch('/api/users/problems', {
        method: 'get',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(
        response => {
          return response.json()
          .then(data => {
            if (data.error) return probErrorHandler(dispatch, data.message);
            else {
              dispatch({ 
                type: PROB_FETCH_MINE,
                payload: { requestStatus: SUCCESS, problems: data.problems }
              });
            }
          });
        }, 
        error => {
          const errorMessage = error.message || 'Failed to communicate with server.';
          return probErrorHandler(dispatch, errorMessage);
        }
      );
    }
  }
}

export function postProposal({
    competition_id, subject, difficulty, statement, answer, solution
  }) {
  return dispatch => {
    dispatch({
      type: PROB_POST,
      payload: { requestStatus: PENDING }
    });
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
        .then(data => {
          if (!data.success) return probErrorHandler(dispatch, data.message);
          else {
            dispatch({ 
              type: PROB_POST,
              payload: { requestStatus: SUCCESS }
            });
          }
        });
      },
      error => {
        const errorMessage = error.message || 'Failed to communicate with server.';
        return probErrorHandler(dispatch, errorMessage);
      }
    );
  }
}

export function getProposal(id) {
  return dispatch => {
    const userId = auth.userId();
    if (!userId) {
      return probErrorHandler(dispatch, 'User is not logged in.');
    } else {
      dispatch({ 
        type: PROB_GET, 
        payload: { requestStatus: PENDING }
      });
      fetch(`/api/problems?${$.param({ id: id })}`, {
        method: 'get',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(
        response => {
          return response.json()
          .then(data => {
            if (data.error) return probErrorHandler(dispatch, data.message);
            else {
              dispatch({ 
                type: PROB_GET,
                payload: { requestStatus: SUCCESS, problem: data.problem }
              });
            }
          });
        }, 
        error => {
          const errorMessage = error.message || 'Failed to communicate with server.';
          return probErrorHandler(dispatch, errorMessage);
        }
      );
    }
  }
}

