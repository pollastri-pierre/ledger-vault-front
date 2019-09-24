// @flow

import React, { useReducer, useEffect } from "react";
import queryString from "query-string";
import { withRouter } from "react-router";
import manager from "@ledgerhq/live-common/lib/manager";
import { Observable } from "rxjs/Observable";
import { from, of, concat, throwError } from "rxjs";
import { concatMap, tap, delay, catchError } from "rxjs/operators";
import { setEnv } from "@ledgerhq/live-common/lib/env";
import { Trans } from "react-i18next";
import type { Location } from "react-router-dom";
import type { MemoryHistory } from "history";
import { TransportWebUSBGestureRequired } from "@ledgerhq/errors";

import colors from "shared/colors";

import {
  withDeviceInfo,
  installApp,
  installFirmware,
} from "device/updateLogic";

import Logs from "device/Logs";
import type { Log as LogType } from "device/Logs";

import { DeviceNotOnDashboard, remapError } from "utils/errors";
import TranslatedError from "components/TranslatedError";
import VaultCentered from "components/VaultCentered";
import Box from "components/base/Box";
import Card from "components/base/Card";
import Button from "components/base/Button";
import ProgressBar from "components/base/ProgressBar";
import Text from "components/base/Text";

export type Step =
  | "idle"
  | "running"
  | "error"
  | "firmware"
  | "osu"
  | "install-app-progress"
  | "osu-progress"
  | "firmware-progress"
  | "uninstall-app"
  | "finished";

const DEV_MODE = true;
const ALREADY_UP_TO_DATE = "Firmware is already up-to-date.";

const fetchVaultApp = deviceInfo =>
  from(
    manager
      .getAppsList(deviceInfo, DEV_MODE, () => Promise.resolve([]))
      .then(results => {
        if (!results || !results.length) {
          throw new Error("No apps found.");
        }
        return results[0];
      }),
  );

type InstallParams = {
  setStep: Step => void,
  addLog: Object => void,
  subscribeProgress: Step => (e: { progress: number }) => void,
};

export function installEverything(params: InstallParams): Observable<*> {
  const { addLog } = params;

  const waitForReboot = of(delay(2000)).pipe(
    tap(() => {
      addLog("Waiting for device to reboot...");
      addLog("Enter your PIN when asked");
    }),
  );

  const firmwareInstallation = concat(
    installFirmware(params),
    waitForReboot,
  ).pipe(
    catchError(err => {
      if (err.message === ALREADY_UP_TO_DATE) {
        addLog("Firmware is already up-to-date");
        return of(null);
      }
      return throwError(err);
    }),
  );

  const appInstallation = withDeviceInfo
    .pipe(
      tap(() => addLog("Fetching app...")),
      concatMap(fetchVaultApp),
    )
    .pipe(
      tap(app => addLog(`Version ${app.firmware} will be installed`)),
      concatMap(app => installApp({ app, ...params })),
    );

  return concat(firmwareInstallation, appInstallation);
}

type TypeAction =
  | "ADD_LOG"
  | "RESET"
  | "SET_ERROR"
  | "SET_STEP"
  | "SET_PROGRESS";

type State = {
  step: Step,
  error: ?Error,
  progress: number,
  logs: LogType[],
};

const initialState: State = {
  step: "idle",
  error: null,
  logs: [],
  progress: 0,
};

let logId = 0;

type Action = { type: TypeAction, payload: any };

const reducer = (state: State, { type, payload }: Action) => {
  switch (type) {
    case "ADD_LOG": {
      const log = { id: logId++, date: new Date(), text: payload };
      return { ...state, logs: [...state.logs, log] };
    }
    case "RESET":
      return initialState;
    case "SET_ERROR":
      let error = remapError(payload); // eslint-disable-line no-case-declarations

      // let's assume if they have TransportWebUSBGestureRequired, it means they are
      // in the old app, that only have U2F support
      if (error instanceof TransportWebUSBGestureRequired)
        error = new DeviceNotOnDashboard();

      return { ...state, step: "error", error };
    case "SET_STEP":
      return { ...state, step: payload };
    case "SET_PROGRESS":
      return { ...state, progress: payload };
    default:
      return state;
  }
};

const provider = window.localStorage.getItem("PROVIDER") || 5;

type Props = {
  location: Location,
  history: MemoryHistory,
};

const UpdateApp = ({ history, location }: Props) => {
  const [state, dispatch] = useReducer<State, Object>(reducer, initialState);
  const { step, error, progress, logs } = state;

  useEffect(() => setEnv("FORCE_PROVIDER", provider), []);

  const subscribeProgress = stepName => e => {
    if (e.progress === 0) {
      setStep(stepName);
    }
    setProgress(e.progress);
  };

  const addLog = msg => dispatch({ type: "ADD_LOG", payload: msg });
  const setStep = step => dispatch({ type: "SET_STEP", payload: step });
  const setProgress = progress =>
    dispatch({ type: "SET_PROGRESS", payload: progress });

  const setError = err => {
    dispatch({ type: "SET_ERROR", payload: err });
    addLog("An error occured. Stopping.");
  };

  const params = { addLog, setStep, subscribeProgress };

  const run = () => {
    setStep("running");
    const sub = installEverything(params).subscribe({
      complete: () => setStep("finished"),
      error: setError,
    });
    return () => {
      sub.unsubscribe();
    };
  };

  const retry = () => {
    dispatch({ type: "RESET" });
    run();
  };

  const showProgressIndeterminate =
    step === "osu" ||
    step === "firmware" ||
    step === "install-app" ||
    step === "uninstall-app";

  const showProgress =
    step === "osu-progress" ||
    step === "firmware-progress" ||
    step === "install-app-progress";

  const isFinished = step === "finished";
  const isIdle = step === "idle";

  const redirectURL = resolveRedirectURL(location.search);
  const redirect = () => history.replace(redirectURL || "/");

  return (
    <VaultCentered>
      <Card flow={20} width={520}>
        <Text large bold i18nKey="update:title" />
        <UserExplanation />
        <Logs logs={logs} />
        <DisplayError error={error} onRetry={retry} />

        {showProgressIndeterminate ? (
          <ProgressBar indeterminate />
        ) : showProgress ? (
          <ProgressBar progress={progress} />
        ) : isFinished ? (
          <>
            <Text i18nKey="update:success" />
            <Button type="primary" onClick={redirect}>
              <Text
                i18nKey={`update:${redirectURL ? "goBack" : "goToLogin"}`}
              />
            </Button>
          </>
        ) : isIdle ? (
          <Button type="primary" onClick={run}>
            <Text i18nKey="update:update" />
          </Button>
        ) : null}
      </Card>
    </VaultCentered>
  );
};

type DisplayErrorProps = {
  error: ?Error,
  onRetry: () => void,
};

const DisplayError = ({ error, onRetry }: DisplayErrorProps) =>
  error ? (
    <>
      <Text color={colors.grenade}>
        <TranslatedError error={error} field="description" />
      </Text>
      <Button onClick={onRetry}>
        <Text i18nKey="update:retry" />
      </Button>
    </>
  ) : null;

const UserExplanation = () => (
  <Box>
    <Text i18nKey="update:info" />
    <ol>
      <li>
        <Trans i18nKey="update:userSteps.step1" components={<b />} />
      </li>
      <li>
        <Trans i18nKey="update:userSteps.step2" components={<b />} />
      </li>
    </ol>
  </Box>
);

function resolveRedirectURL(search: string) {
  const q = queryString.parse(search);
  return q.redirectTo || null;
}

export default withRouter(UpdateApp);
