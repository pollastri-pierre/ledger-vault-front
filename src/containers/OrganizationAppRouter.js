import React, { Fragment } from "react";
import { BrowserRouter } from "react-router-dom";
import CounterValues from "data/CounterValues";
import { Switch, Route } from "react-router";
import AlertsContainer from "containers/AlertsContainer";
import UpdateApp from "components/UpdateApp";
import MockDevices from "components/MockDevices";
import Welcome from "./Welcome";

import App from "./App/App";
import Login from "./Login/Login";
import Logout from "./Login/Logout";
import OnboardingContainer from "./Onboarding/OnboardingContainer";
import PrivateRoute from "./Login/PrivateRoute";

const OrganizationAppRouter = () => (
  <Fragment>
    <AlertsContainer />
    {process.env.NODE_ENV === "e2e" && <MockDevices />}

    <BrowserRouter>
      <Switch>
        <Route path="/update-app" component={UpdateApp} />
        <Route
          path="/:orga_name"
          render={({ match, history, location }) => (
            <Fragment>
              <Switch>
                <Route
                  path={`${match.url}/login`}
                  render={() => (
                    <Login
                      match={match}
                      location={location}
                      history={history}
                    />
                  )}
                />
                <Route
                  path={`${match.url}/onboarding`}
                  render={() => (
                    <OnboardingContainer match={match} history={history} />
                  )}
                />
                <Route
                  path={`${match.url}/logout`}
                  render={() => <Logout match={match} />}
                />
                <CounterValues.PollingProvider>
                  <PrivateRoute
                    path={`${match.url}/`}
                    component={App}
                    history={history}
                    match={match}
                  />
                </CounterValues.PollingProvider>
              </Switch>
            </Fragment>
          )}
        />
        <Route component={Welcome} />
      </Switch>
    </BrowserRouter>
  </Fragment>
);

export default OrganizationAppRouter;
