// @flow

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import counterValues from "data/counterValues";
import { Switch, Route } from "react-router";
import type { Match } from "react-router-dom";
import type { MemoryHistory } from "history";

import AlertsContainer from "components/legacy/AlertsContainer";
import UpdateApp from "components/UpdateApp/LinksToUpdater";
import MockDevices from "components/MockDevices";
import GlobalStyle from "components/GlobalStyle";
import OnboardingContainer from "components/legacy/Onboarding/OnboardingContainer";
import { checkLogin } from "redux/modules/auth";
import Welcome from "./Welcome";
import Login from "./Login";

import App from "./App/App";
import Logout from "./Login/Logout";
import PrivateRoute from "./Login/PrivateRoute";
import RegisterUser from "./RegisterUser";

const { PollingProvider } = counterValues;

type Props = {
  match: Match,
  history: MemoryHistory,
};

const OrganizationComponent = ({ match, history }: Props) => {
  const isLoggedLoading = useCheckLogin();

  // return nothing while checking for user logged or not
  if (isLoggedLoading) return null;

  return (
    <Switch>
      <Route path={`${match.url}/login`} component={Login} />
      <Route path="*/update-app" component={UpdateApp} />
      <Route
        path={`${match.url}/onboarding`}
        render={() => <OnboardingContainer match={match} history={history} />}
      />
      <Route
        path={`${match.url}/logout`}
        render={() => <Logout match={match} />}
      />
      <Route path={`${match.url}/register/:urlID`} component={RegisterUser} />
      <PollingProvider>
        <PrivateRoute
          path={`${match.url}/`}
          component={App}
          history={history}
          match={match}
        />
      </PollingProvider>
    </Switch>
  );
};

const OrganizationAppRouter = () => (
  <>
    <GlobalStyle />
    <BrowserRouter>
      <AlertsContainer />
      <Switch>
        <Route path="/:orga_name" component={OrganizationComponent} />
        <Route component={Welcome} />
      </Switch>
    </BrowserRouter>
    {process.env.NODE_ENV === "e2e" && <MockDevices />}
  </>
);

function useCheckLogin() {
  const [isLoading, setLoading] = useState(true);
  const dispatch = useDispatch();
  useEffect(() => {
    let isUnmounted = false;
    const effect = async () => {
      await dispatch(checkLogin());
      if (isUnmounted) return;
      setLoading(false);
    };
    effect();
    return () => {
      isUnmounted = true;
    };
  }, [dispatch]);
  return isLoading;
}

export default OrganizationAppRouter;
