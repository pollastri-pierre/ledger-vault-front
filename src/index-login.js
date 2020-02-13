// @flow

import React from "react";
import { createStore, combineReducers } from "redux";
import { Route, Switch, Redirect } from "react-router-dom";
import { render } from "react-dom";

import { reducer as data } from "restlay/dataStore";
import UpdateDevice from "components/UpdateDevice";
import Login, { LoginDevice } from "components/Login";
import Root from "./Root";

const store = createStore(combineReducers({ data }));

const App = () => (
  <Root store={store}>
    <Switch>
      <Route path="/update-app" component={UpdateDevice} />
      <Route path="/:workspace/login" exact component={LoginDevice} />
      <Route path="/" exact component={Login} />
      <Redirect to="/" />
    </Switch>
  </Root>
);

const root = document.getElementById("root");
root && render(<App />, root);
