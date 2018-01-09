import React, { Fragment } from "react";
import { BrowserRouter } from "react-router-dom";
import { Switch, Route } from "react-router";

import App from "containers/App/App";

import Login from "containers/Login/Login";
import LoginTest from "containers/LoginTest";
import Logout from "containers/Login/Logout";
import AlertsContainer from "containers/AlertsContainer";
import PrivateRoute from "containers/Login/PrivateRoute";

function Container() {
  return (
    <Fragment>
      <AlertsContainer />
      <BrowserRouter>
        <Switch>
          <Route path="/login" component={Login} />
          <Route path="/logintest" component={LoginTest} />
          <Route path="/logout" component={Logout} />
          <PrivateRoute path="/" component={App} />
        </Switch>
      </BrowserRouter>
    </Fragment>
  );
}

export default Container;
