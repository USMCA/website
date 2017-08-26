import { combineReducers } from 'redux';  
import { reducer as formReducer } from 'redux-form';

import initReducer from './init-reducer.js';
import usersReducer from './users-reducer.js';
import authReducer from './auth-reducer.js';
import contestsReducer from './contests-reducer.js';
import competitionsReducer from './competitions-reducer.js';
import problemsReducer from './problems-reducer.js';

const rootReducer = combineReducers({
  /* state appears in this form */
  init: initReducer, 
  users: usersReducer,
  auth: authReducer,
  contests: contestsReducer,
  competitions: competitionsReducer,
  problems: problemsReducer,
  form: formReducer
});

export default rootReducer;
