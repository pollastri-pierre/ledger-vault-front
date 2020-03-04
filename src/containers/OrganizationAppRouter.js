// @flow

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import counterValues from "data/counterValues";
import { Switch, Route } from "react-router";
import type { Match } from "react-router-dom";
import type { MemoryHistory } from "history";

import connectData from "restlay/connectData";
import AlertsContainer from "components/legacy/AlertsContainer";
import VersionsQuery from "api/queries/VersionsQuery";
import UpdateDevice from "components/UpdateDevice";
import type { RestlayEnvironment } from "restlay/connectData";
import MockDevices from "components/MockDevices";
import { VersionsContextProvider } from "components/VersionsContext";
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

const OrganizationAppRouter = ({
  restlay,
}: {
  restlay: RestlayEnvironment,
}) => {
  const [versions, setVersions] = useState(null);
  const update = useCallback(async () => {
    const _versions = await restlay.fetchQuery(new VersionsQuery());
    setVersions(_versions);
  }, [setVersions, restlay]);
  const versionContextValue = useMemo(
    () => ({
      versions,
      update,
    }),
    [versions, update],
  );
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <VersionsContextProvider value={versionContextValue}>
          <AlertsContainer />
          <Switch>
            <Route path="/update-app" component={UpdateDevice} />
            <Route path="/:orga_name" component={OrganizationComponent} />
            <Route component={Welcome} />
          </Switch>
        </VersionsContextProvider>
      </BrowserRouter>
      {process.env.NODE_ENV === "e2e" && <MockDevices />}
    </>
  );
};

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

export default connectData(OrganizationAppRouter);
