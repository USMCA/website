import fetch from 'isomorphic-fetch';

import { 
  COMP_ERROR,
  COMP_REQ,
  COMP_RES,
  COMP_FETCH_MINE,
  requestStatuses
} from './types';
import { requestTypes } from '../../constants';
import auth from '../auth';

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
  return dispatch => {
    dispatch({ 
      type: COMP_REQ, 
      payload: { requestStatus: requestStatuses.PENDING }
    });

    const userId = auth.userId();
    if (!userId) return compErrorHandler(dispatch, 'User not logged in.');
    fetch('/api/competitions', {
      method: 'post',
      body: JSON.stringify({ 
        type: requestTypes.REQUEST, 
        competition: {
          name, shortName, website 
        },
        userId: userId
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
          if (!data.success) compErrorHandler(dispatch, data.message);
          else {
            dispatch({ 
              type: COMP_REQ, 
              payload: {
                requestStatus: requestStatuses.SUBMITTED 
              }
            });
          }
        });
      }, 
      error => {
        errorMessage = error.message || 'Failed to communicate with server.';
        return compErrorHandler(dispatch, errorMessage);
      }
    );
  }
}

export function fetchMyCompetitions() {
  return dispatch => {
    const userId = auth.userId();
    if (!userId) {
      return compErrorHandler(dispatch, 'User is not logged in.');
    } else {
      dispatch({
        type: COMP_FETCH_MINE,
        payload: { requestStatus: requestStatuses.PENDING }
      });
      fetch('/api/users/competitions', {
        method: 'get',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }).then(
        response => {
          return response.json()
          .then(data => {
            if (!data.success) compErrorHandler(dispatch, data.message);
            else {
              dispatch({
                type: COMP_FETCH_MINE,
                payload: {
                  requestStatus: requestStatuses.SUCCESS,
                  competitions: data.competitions
                }
              });
            }
          });
        },
        error => {
          errorMessage = error.message || 'Failed to communicate with server.';
          return compErrorHandler(dispatch, errorMessage);
        }
      );
    }
  }
}
