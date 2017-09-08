import { createStore as _createStore, applyMiddleware, combineReducers } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux'
import { composeWithDevTools } from 'redux-devtools-extension';
import reducers from './modules/index';
import thunk from 'redux-thunk';

export default function createStore(history, data) {
  const middleware = routerMiddleware(history);
  const combinedReducers = combineReducers({
    ...reducers,
    routing: routerReducer
  })

  const store = _createStore(combinedReducers, data, composeWithDevTools(applyMiddleware(middleware, thunk)));
  return store;
}

