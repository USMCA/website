import fetch from 'isomorphic-fetch';

import { 
  CONTEST_POST,
  CONTEST_GET,
  CONTEST_TEST_POST,
  requestStatuses,
  requestPayloads
} from './types';
import { requestTypes } from '../../constants';
import auth from '../auth';
import { authenticate, APIAction, authAPIAction } from './utilities';

const { SUCCESS, PENDING, SUBMITTED, IDLE, ERROR } = requestStatuses;
const {
  successPayload,
  errorPayload,
  idlePayload,
  pendingPayload
} = requestPayloads;

/*******************************************************************************
 * Async thunk actions.
 ******************************************************************************/

export function postContest({ competition_id, name, date, locations }) {
  let action = { type: CONTEST_POST };
  return dispatch => {
    authenticate(action, dispatch, userId => {
      dispatch(Object.assign(action, pendingPayload()));
      fetch('/api/contests', {
        method: 'post',
        body: JSON.stringify({ competition_id, name, date, locations }),
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      }).then(
        res => res.json().then(({ success, message }) => {
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

export function getContest(contest_id) {
  return APIAction({
    type: CONTEST_GET,
    url: `/api/contests/${contest_id}`,
    opts: { method: 'get' },
    formatData: ({ success, message, contest }) => ({ success, message, content: contest })  
  });
}

export function postTest({ name, num_problems, contest_id }) {
  return authAPIAction({
    type: CONTEST_TEST_POST,
    url: `/api/contests/${contest_id}/tests`,
    opts: {
      method: 'post',
      body: JSON.stringify({ name, num_problems }),
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    },
    formatData: ({ success, message, test }) => ({ success, message, content: test })
  });
}
