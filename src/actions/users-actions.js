import fetch from 'isomorphic-fetch';
import $ from 'jquery';

import auth from '../auth';
import { fetchMyCompetitions } from './competitions-actions';
import {
  requestStatuses,
  USER_ERROR,
  USER_INFO,
  USER_ADMIN,
  USER_COMP_RES
} from './types';
import { requestTypes } from '../../constants';

/*******************************************************************************
 * Synchronous actions.
 ******************************************************************************/

export function userErrorHandler(dispatch, errorMessage) {
  dispatch({ type: USER_ERROR, payload: errorMessage});
}

/*******************************************************************************
 * Async thunk actions.
 ******************************************************************************/
export function userInfo() {
  return dispatch => {
    dispatch({ 
      type: USER_INFO, 
      payload: { 
        requestStatus: requestStatuses.PENDING
      }
    });
    const userId = auth.userId();
    if (userId) {
      fetchMyCompetitions()(dispatch);
      fetch(`/api/users?${$.param({ id: userId })}`, { 
        method: 'get',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      .then(
        response => {
          return response.json()
          .then(data => {
            const { error, message, user } = data;
            if (error) userErrorHandler(dispatch, message);
            else {
              dispatch({
                type: USER_INFO,
                payload: {
                  requestStatus: requestStatuses.SUCCESS,
                  user: user
                }
              });
            }
          });
        }, 
        error => {
          errorMessage = error.message || 'Failed to communicate with server.';
          userErrorHandler(dispatch, errorMessage);
        }
      );
    }
  }
}

export function adminInfo() {
  return dispatch => {
    dispatch({ 
      type: USER_ADMIN, 
      payload: { 
        requestStatus: requestStatuses.PENDING
      }
    });
    fetch('/api/users/admin', { method: 'get' })
    .then(
      response => {
        return response.json()
        .then(data => {
          const { error, message, admins } = data;
          if (error) userErrorHandler(dispatch, message);
          else {
            dispatch({
              type: USER_ADMIN,
              payload: {
                requestStatus: requestStatuses.SUCCESS,
                admins: admins
              }
            });
          }
        });
      }, 
      error => {
        errorMessage = error.message || 'Failed to communicate with server.';
        userErrorHandler(dispatch, errorMessage);
      }
    );
  }
}

export function respondCompetition(request, adminResponse) {
  return dispatch => {
    if (!auth.isAdmin()) userErrorHandler(dispatch, 'User is not an admin.');
    if (adminResponse !== requestTypes.ACCEPT && 
        adminResponse !== requestTypes.REJECT) {
      userErrorHandler(dispatch, 'Invalid response to request.');
    }
    dispatch({ 
      type: USER_COMP_RES, 
      payload: { requestStatus: requestStatuses.PENDING }
    });
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
      response => {
        return response.json()
        .then(data => {
          if (!data.success) userErrorHandler(dispatch, data.message);
          else {
            dispatch({ 
              type: USER_COMP_RES, 
              payload: {
                requestId: request._id,
                requestStatus: requestStatuses.SUCCESS
              }
            });
          }
        });
      },
      error => {
        errorMessage = error.message || 'Failed to communicate with server.';
        userErrorHandler(dispatch, errorMessage);
      }
    );
  }
}

