import fetch from 'isomorphic-fetch';

import { 
  CONTEST_ERROR,
  CONTEST_POST,
  requestStatuses
} from './types';
import { requestTypes } from '../../constants';
import auth from '../auth';

const { SUCCESS, PENDING, SUBMITTED, IDLE } = requestStatuses;

/*******************************************************************************
 * Synchronous actions.
 ******************************************************************************/

export function contestErrorHandler(dispatch, errorMessage) {
  dispatch({ type: CONTEST_ERROR, payload: errorMessage });
}

export function resetCreateContestForm(dispatch) {
  dispatch({ type: CONTEST_POST, payload: { requestStatus: IDLE } });
}

/*******************************************************************************
 * Async thunk actions.
 ******************************************************************************/

export function postContest({ competition_id, name, date, locations }) {
  return dispatch => {
    dispatch({ 
      type: CONTEST_POST, 
      payload: { requestStatus: PENDING }
    });
    const userId = auth.userId();
    if (!userId) return contestErrorHandler(dispatch, 'User not logged in.');

    fetch('/api/contests', {
      method: 'post',
      body: JSON.stringify({ 
        competition_id, name, date, locations
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
          if (!data.success) contestErrorHandler(dispatch, data.message);
          else {
            dispatch({ 
              type: CONTEST_POST, 
              payload: {
                requestStatus: SUCCESS
              }
            });
          }
        });
      }, 
      error => {
        errorMessage = error.message || 'Failed to communicate with server.';
        return contestErrorHandler(dispatch, errorMessage);
      }
    );
  }
}
