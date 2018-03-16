import { combineReducers } from 'redux';

import roles from './roles';
import dashboards from './dashboards';
import ranklist from './ranklist';
import sections from './sections';
import error from './error';


const rootReducer = combineReducers({
  roles,
  dashboards,
  ranklist,
  sections,
  error
});

export default rootReducer;
