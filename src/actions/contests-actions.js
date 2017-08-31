import fetch from 'isomorphic-fetch';

import { 
  CONTEST_POST,
  requestStatuses,
  requestPayloads
} from './types';
import { requestTypes } from '../../constants';
import auth from '../auth';
import { authenticate } from './utilities';

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
