import fetch from 'isomorphic-fetch';
import * as $ from 'jquery';

import {
  requestPayloads,
  PROB_FETCH_MINE,
  PROB_POST,
  PROB_PUT,
  PROB_GET,
  PROB_UPVOTE,
  PROB_COMMENT,
  PROB_DATABASE,
  PROB_PUBLIC_DATABASE,
  PROB_TAKE,
  PROB_PUBLICIZE,
  PROB_TEST_SOLVE,
  PROB_PROB_COMMENT,
  PROB_SOLN_COMMENT,
} from './types';
import auth from '../auth';
import {
  authenticate,
  serverError,
  APIAction,
  authAPIAction
} from './utilities';

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
  return authAPIAction({
    type: PROB_FETCH_MINE,
    url: '/api/users/problems',
    opts: {
      method: 'get',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    },
    formatData: ({ success, message, problems }) => ({
      success, message, content: problems
    })
  });
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
  return authAPIAction({
    type: PROB_GET,
    url: `/api/problems/${id}`,
    opts: {
      method: 'get',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
    },
    formatData: ({ success, message, problem }) => ({
      success, message, content: problem
    })
  });
}

export function putProposal(id, proposal) {
  return authAPIAction({
    type: PROB_PUT,
    url: `/api/problems/${id}`,
    opts: {
      method: 'put',
      body: JSON.stringify(proposal),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    },
    formatData: ({ success, message, problem }) => ({
      success, message, content: problem
    })
  });
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

export function fetchDatabase(id, args) {
  let action = { type: PROB_DATABASE };
  const { subject, difficulty } = args ? args : {};
  return dispatch => {
    authenticate(action, dispatch, userId => {
      dispatch(Object.assign(action, pendingPayload()));
      const opts = { id, subject, difficulty }; //@TODO support other query
      fetch(`api/competitions/database?${$.param(opts)}`, {
        method: 'get',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      }).then(
        res => res.json().then(({ success, message, competition, problems }) => {
          if (!success) {
            dispatch(Object.assign(action, errorPayload(message)));
          } else {
            dispatch(Object.assign(action, successPayload({
              content: { competition, problems }
            })));
          }
        }),
        serverError(action, dispatch)
      );
    });
  };
}

export function testSolve(problem_id, solution) {
  return authAPIAction({
    type: PROB_TEST_SOLVE,
    url: '/api/problems/test-solve',
    opts: {
      method: 'post',
      body: JSON.stringify({ problem_id, solution }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    },
    formatData: ({ success, message, alternate_soln }) => {
      return { success, message, content: alternate_soln };
    }
  });
}

export function publicDatabase() {
  return authAPIAction({
    type: PROB_PUBLIC_DATABASE,
    url: '/api/problems/public',
    opts: {
      method: 'get',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    },
    formatData: ({ success, message, problems }) => {
      return { success, message, content: problems };
    }
  });
}

export function takeProblem(problem_id, competition_id) {
  return authAPIAction({
    type: PROB_TAKE,
    url: '/api/problems/public',
    opts: {
      method: 'post',
      body: JSON.stringify({ problem_id, competition_id }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    },
    formatData: ({ success, message, problem }) => {
      return { success, message, content: problem };
    }
  });
}

export function publicizeProblem(problem_id) {
  return authAPIAction({
    type: PROB_PUBLICIZE,
    url: '/api/problems/publicize',
    opts: {
      method: 'post',
      body: JSON.stringify({ problem_id }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    },
    formatData: ({ success, message, problem_id }) => {
      return { success, message, content: problem_id };
    }
  });
}

export function probComment(problem_id, body) {
  return authAPIAction({
    type: PROB_PROB_COMMENT,
    url: '/api/problems/comment/problem',
    opts: {
      method: 'post',
      body: JSON.stringify({ problem_id, body }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    },
    formatData: ({ success, message, comments }) => {
      return { success, message, content: comments };
    }
  });
}

export function solnComment(solution_id, body) {
  return authAPIAction({
    type: PROB_SOLN_COMMENT,
    url: '/api/problems/comment/solution',
    opts: {
      method: 'post',
      body: JSON.stringify({ solution_id, body }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    },
    formatData: ({ success, message, alternate_soln }) => {
      return { success, message, content: alternate_soln };
    }
  });
}
