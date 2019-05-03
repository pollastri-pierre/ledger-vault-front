import React from "react";
import { BrowserRouter } from "react-router-dom";
import counterValues from "data/counterValues";
import { Switch, Route } from "react-router";
import AlertsContainer from "containers/AlertsContainer";
import UpdateApp from "components/UpdateApp";
import MockDevices from "components/MockDevices";
import GlobalStyle from "components/GlobalStyle";
import Welcome from "./Welcome";

import App from "./App/App";
import Logout from "./Login/Logout";
import OnboardingContainer from "./Onboarding/OnboardingContainer";
import PrivateRoute from "./Login/PrivateRoute";
import RegisterUser from "./RegisterUser";

const { PollingProvider } = counterValues;

const OrganizationAppRouter = () => (
  <>
    <GlobalStyle />

    <BrowserRouter>
      <>
        <AlertsContainer />
        <Switch>
          <Route path="/update-app" component={UpdateApp} />
          <Route
            path="/:orga_name"
            render={({ match, history, location }) => (
              <>
                <Switch>
                  <Route
                    path={`${match.url}/login`}
                    render={() => (
                      <Welcome
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
                  <Route
                    path={`${match.url}/register/:urlID`}
                    component={RegisterUser}
                  />
                  <PollingProvider>
                    <PrivateRoute
                      path={`${match.url}/`}
                      component={App}
                      history={history}
                      match={match}
                    />
                  </PollingProvider>
                </Switch>
              </>
            )}
          />
          <Route component={Welcome} />
        </Switch>
      </>
    </BrowserRouter>
    {process.env.NODE_ENV === "e2e" && <MockDevices />}
  </>
);

export default OrganizationAppRouter;
