// @flow

import React, { useReducer, useEffect, useState } from "react";
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
import { DisconnectedDeviceDuringOperation } from "@ledgerhq/errors";

import {
  withDeviceInfo,
  installApp,
  installFirmware,
} from "device/updateLogic";

import Logs from "device/Logs";
import type { Log as LogType } from "device/Logs";

import { remapError } from "utils/errors";
import TranslatedError from "components/TranslatedError";
import VaultCentered from "components/VaultCentered";
import Box from "components/base/Box";
import InfoBox from "components/base/InfoBox";
import FakeLink from "components/base/FakeLink";
import Card from "components/base/Card";
import Button from "components/base/Button";
import ProgressBar from "components/base/ProgressBar";
import Text from "components/base/Text";
import LinksToUpdater from "./LinksToUpdater";

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

type InstallParams = {|
  setStep: Step => void,
  addLog: Object => void,
  subscribeProgress: Step => (e: { progress: number }) => void,
|};

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
      return { ...state, step: "error", error: remapError(payload) };
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
  const [isLinksModalOpened, setLinksModalOpened] = useState(false);
  const [state, dispatch] = useReducer<State, Object>(reducer, initialState);
  const { step, error, progress, logs } = state;

  useEffect(() => setEnv("FORCE_PROVIDER", provider), []);

  const openLinksModal = () => setLinksModalOpened(true);
  const closeLinksModal = () => setLinksModalOpened(false);

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
    if (err instanceof DisconnectedDeviceDuringOperation) {
      addLog("Device rebooting...");
    } else {
      addLog("An error occured. Stopping.");
    }
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
        <Text size="large" fontWeight="bold" i18nKey="update:title" />
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
            <Button type="filled" onClick={redirect}>
              <Text
                i18nKey={`update:${redirectURL ? "goBack" : "goToLogin"}`}
              />
            </Button>
          </>
        ) : isIdle ? (
          <Button type="filled" onClick={run}>
            <Text i18nKey="update:update" />
          </Button>
        ) : null}
        <Box style={{ textAlign: "center" }}>
          <Text size="small">
            {"Troubleshooting? "}
            <FakeLink style={{ display: "inline" }} onClick={openLinksModal}>
              Download standalone updater
            </FakeLink>
          </Text>
        </Box>
        <LinksToUpdater
          isOpened={isLinksModalOpened}
          onClose={closeLinksModal}
        />
      </Card>
    </VaultCentered>
  );
};

type DisplayErrorProps = {
  error: ?Error,
  onRetry: () => void,
};

const DisplayError = ({ error, onRetry }: DisplayErrorProps) => {
  if (!error) return null;
  const isDisconnected = error instanceof DisconnectedDeviceDuringOperation;
  return (
    <>
      <InfoBox type={isDisconnected ? "info" : "error"}>
        {isDisconnected ? (
          <span>
            The device is rebooting or has been disconnected. Please click{" "}
            <b>Continue</b> when the device is ready.
          </span>
        ) : (
          <TranslatedError error={error} field="description" />
        )}
      </InfoBox>
      <Button type="filled" onClick={onRetry}>
        {isDisconnected ? "Continue" : <Text i18nKey="update:retry" />}
      </Button>
    </>
  );
};

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

function resolveRedirectURL(search: string): string | null {
  const q = queryString.parse(search);
  return q.redirectTo ? q.redirectTo.toString() : null;
}

export default withRouter(UpdateApp);
