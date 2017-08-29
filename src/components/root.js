import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import App from './app';
import configureStore from '../configureStore';
import { initApp } from '../actions';
import { AUTH_USER, requestStatuses } from '../actions/types';

import auth from '../auth';

const store = configureStore();

if (auth.isLoggedIn()) {
  store.dispatch({ 
    type: AUTH_USER, 
    payload: { content: {}, requestStatus: requestStatuses.SUCCESS } 
  });
}
initApp()(store.dispatch);

const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
)

export default Root;
