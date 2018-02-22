import { createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';

export default function configureStore() {
  const createStoreWithMiddleware = applyMiddleware(
    thunk
  )(createStore);

  let store = createStoreWithMiddleware(rootReducer);
  return store;
}
