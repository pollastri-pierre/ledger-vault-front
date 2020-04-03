// @flow

import React from "react";
import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { Route } from "react-router-dom";
import { render } from "react-dom";

import { reducer as data } from "restlay/dataStore";
import Onboarding from "components/Onboarding";
import UpdateDevice from "components/UpdateDevice";
import onboarding from "./redux/modules/onboarding";
import Root from "./Root";

const store = createStore(
  combineReducers({ data, onboarding }),
  undefined,
  applyMiddleware(thunk),
);

const App = () => (
  <Root store={store}>
    <Route path="/update-app" component={UpdateDevice} />
    <Route path="/:workspace/onboarding" exact component={Onboarding} />
  </Root>
);

const root = document.getElementById("root");
root && render(<App />, root);
