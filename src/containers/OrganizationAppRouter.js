import React, { Fragment } from "react";
import { BrowserRouter } from "react-router-dom";
import { Switch, Route } from "react-router";
import Welcome from "./Welcome";
import AlertsContainer from "containers/AlertsContainer";

import App from "./App/App";
import Login from "./Login/Login";
import Logout from "./Login/Logout";
import UpdateApp from "components/UpdateApp";
import OnboardingContainer from "./Onboarding/OnboardingContainer";
import PrivateRoute from "./Login/PrivateRoute";

const OrganizationAppRouter = () => {
  return (
    <Fragment>
      <AlertsContainer />

      <BrowserRouter>
        <Switch>
          <Route path="/update-app" component={UpdateApp} />
          <Route
            path="/:orga_name"
            render={({ match, history, location }) => {
              return (
                <Fragment>
                  <Switch>
                    <Route
                      path={`${match.url}/login`}
                      render={() => {
                        return (
                          <Login
                            match={match}
                            location={location}
                            history={history}
                          />
                        );
                      }}
                    />
                    <Route
                      path={`${match.url}/onboarding`}
                      render={() => {
                        return (
                          <OnboardingContainer
                            match={match}
                            history={history}
                          />
                        );
                      }}
                    />
                    <Route
                      path={`${match.url}/logout`}
                      render={() => {
                        return <Logout match={match} />;
                      }}
                    />
                    <PrivateRoute
                      path={`${match.url}/`}
                      component={App}
                      history={history}
                      match={match}
                    />
                  </Switch>
                </Fragment>
              );
            }}
          />
          <Route component={Welcome} />
        </Switch>
      </BrowserRouter>
    </Fragment>
  );
};

export default OrganizationAppRouter;
