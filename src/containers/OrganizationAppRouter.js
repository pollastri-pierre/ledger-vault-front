import React from "react";
import { BrowserRouter } from "react-router-dom";
import ModalRoute from "components/ModalRoute";
import counterValues from "data/counterValues";
import { Switch, Route } from "react-router";
import AlertsContainer from "containers/AlertsContainer";
import UpdateApp from "components/UpdateApp";
import MockDevices from "components/MockDevices";
import GlobalStyle from "components/GlobalStyle";
import Welcome from "./Welcome";
import Login from "./Login";

import App from "./App/App";
import Logout from "./Login/Logout";
import OnboardingContainer from "./Onboarding/OnboardingContainer";
import PrivateRoute from "./Login/PrivateRoute";
import RegisterUser from "./RegisterUser";

const { PollingProvider } = counterValues;

// as connect() returns now a React.memo, this is a hack to prevent
// react-router Router component to complain that it doesnt receive
// a function but an object
const WelcomeComponent = p => <Welcome {...p} />;
const LoginComponent = p => <Login {...p} />;

const OrganizationAppRouter = () => (
  <>
    <GlobalStyle />
    <BrowserRouter>
      <>
        <AlertsContainer />
        <Switch>
          <Route
            path="/:orga_name"
            render={({ match, history }) => (
              <>
                <Switch>
                  <Route path={`${match.url}/login`} render={LoginComponent} />
                  <ModalRoute
                    path={`${match.url}/update-app`}
                    component={UpdateApp}
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
          <Route component={WelcomeComponent} />
        </Switch>
      </>
    </BrowserRouter>
    {process.env.NODE_ENV === "e2e" && <MockDevices />}
  </>
);

export default OrganizationAppRouter;
