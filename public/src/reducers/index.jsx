import { combineReducers } from 'redux';

import groups from './groups';
import dashboards from './dashboards';
import ranklist from './ranklist';
import error from './error';


const rootReducer = combineReducers({
  groups,
  dashboards,
  ranklist,
  error
});

export default rootReducer;
