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
import Onboarding from "components/Onboarding";
import PrivateRoute from "components/PrivateRoute";
import Logout from "components/Logout";
import { LoginLoading } from "components/Login";
import { checkLogin } from "redux/modules/auth";
import { EmulatorProvider } from "components/Emulator/EmulatorContext";
import EmulatorWrapper from "components/Emulator/EmulatorWrapper";

import App from "./App/App";

let Login;
let LoginDevice;
let RegisterUser;

if (process.env.NODE_ENV !== "production") {
  Login = require("components/Login").default;
  LoginDevice = require("components/Login").LoginDevice;
  RegisterUser = require("containers/RegisterUser").default;
}

const { PollingProvider } = counterValues;

type Props = {
  match: Match,
  history: MemoryHistory,
};

const OrganizationComponent = ({ match, history }: Props) => {
  const isLoggedLoading = useCheckLogin();

  // return nothing while checking for user logged or not
  if (isLoggedLoading) return <LoginLoading />;

  return (
    <Switch>
      {process.env.NODE_ENV !== "production" && (
        // in production, Onboarding is handled in a different bundle
        <Route path="/:workspace/onboarding" component={Onboarding} />
      )}
      {process.env.NODE_ENV !== "production" && (
        // in production, Register is handled in a different bundle
        <Route path="/:workspace/register/:urlID" component={RegisterUser} />
      )}
      <Route path="/:workspace/logout" component={Logout} />
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
    <EmulatorProvider>
      <GlobalStyle />
      <EmulatorWrapper />
      <BrowserRouter>
        <VersionsContextProvider value={versionContextValue}>
          <AlertsContainer />
          <Switch>
            <Route path="/update-app" component={UpdateDevice} />
            {process.env.NODE_ENV !== "production" && (
              // in production, Onboarding is handled in a different bundle
              <Route path="/" exact component={Login} />
            )}
            {process.env.NODE_ENV !== "production" && (
              // in production, Onboarding is handled in a different bundle
              <Route path="/:workspace/login" exact component={LoginDevice} />
            )}
            <Route path="/:workspace" component={OrganizationComponent} />
          </Switch>
        </VersionsContextProvider>
      </BrowserRouter>
      {process.env.NODE_ENV === "e2e" && <MockDevices />}
    </EmulatorProvider>
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
