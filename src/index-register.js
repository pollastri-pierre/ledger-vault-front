// @flow

import React from "react";
import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { Route, Switch } from "react-router-dom";
import { render } from "react-dom";

import { reducer as data } from "restlay/dataStore";
import UpdateDevice from "components/UpdateDevice";
import { VersionsContextProvider } from "components/VersionsContext";
import AlertsContainer from "components/legacy/AlertsContainer";
import RegisterUser from "containers/RegisterUser";
import Root from "./Root";
import alerts from "./redux/modules/alerts";

const store = createStore(
  combineReducers({ data, alerts }),
  undefined,
  applyMiddleware(thunk),
);

const VERSIONS = { versions: null, update: async () => {} };

const App = () => (
  <Root store={store}>
    <VersionsContextProvider value={VERSIONS}>
      <AlertsContainer />
      <Switch>
        <Route path="/update-app" component={UpdateDevice} />
        <Route path="/:workspace/register/:urlID" component={RegisterUser} />
      </Switch>
    </VersionsContextProvider>
  </Root>
);

const root = document.getElementById("root");
root && render(<App />, root);
