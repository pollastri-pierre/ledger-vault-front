// @flow
import { createStore, applyMiddleware, combineReducers } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import reducers from "./modules/index";

export default (data: *) =>
  createStore(
    combineReducers(reducers),
    data,
    // $FlowFixMe
    composeWithDevTools(applyMiddleware(thunk)),
  );
