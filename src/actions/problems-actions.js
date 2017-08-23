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
        payload: { status: PENDING }
      });
      fetch(`/api/users/problems`, {
        method: 'get',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(
        response => {
          return response.json()
          .then(data => {
            if (data.error) probErrorHandler(dispatch, data.message);
            else {
              dispatch({ 
                type: PROB_FETCH_MINE,
                payload: { status: SUCCESS, problems: data.problems }
              });
            }
          });
        }, 
        error => {
          errorMessage = error.message || 'Failed to communicate with server.';
          probErrorHandler(dispatch, errorMessage);
        }
      );
    }
  }
}

export function postProposal(proposal) {
  return dispatch => {
    dispatch({
      type: PROB_POST,
      payload: { status: PENDING }
    });
  }
}
