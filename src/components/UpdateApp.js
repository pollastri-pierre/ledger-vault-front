// @flow
import React, { useReducer, useEffect } from "react";
import manager from "@ledgerhq/live-common/lib/manager";
import { Observable } from "rxjs/Observable";
import TranslatedError from "components/TranslatedError";
import VaultCentered from "components/VaultCentered";
import { from, of, concat, throwError } from "rxjs";
import { concatMap, tap, delay, catchError } from "rxjs/operators";
import colors from "shared/colors";
import { setEnv } from "@ledgerhq/live-common/lib/env";

import {
  withDeviceInfo,
  installApp,
  installFirmware,
} from "device/updateLogic";
import Logs from "device/Logs";
import type { Log } from "device/Logs";

import Box from "components/base/Box";
import Button from "components/base/Button";
import ProgressBar from "components/base/ProgressBar";
import Text from "components/base/Text";

const DEV_MODE = true;

const ALREADY_UP_TO_DATE = "Firmware is already up-to-date.";

export function installEverything({
  addLog,
  setStep,
  subscribeProgress,
}: {
  setStep: string => void,
  addLog: Object => void,
  subscribeProgress: string => (e: { progress: number }) => void,
}): Observable<*> {
  return concat(
    installFirmware({ addLog, setStep, subscribeProgress }).pipe(
      catchError(err => {
        if (err.message === ALREADY_UP_TO_DATE) {
          addLog("Firmware is already up-to-date");
          return of(null);
        }
        return throwError(err);
      }),
    ),
    of(delay(2000)).pipe(
      tap(() => {
        addLog("Waiting for device to reboot...");
        addLog("Enter your PIN when asked");
      }),
    ),
    withDeviceInfo
      .pipe(
        tap(() => {
          addLog("Fetching app...");
        }),
        concatMap(deviceInfo =>
          from(
            manager
              .getAppsList(deviceInfo, DEV_MODE, () => Promise.resolve([]))
              .then(results => {
                if (!results || !results.length) {
                  throw new Error("No apps found.");
                }
                return results[0];
              }),
          ),
        ),
      )
      .pipe(
        tap(app => {
          addLog(`Version ${app.firmware} will be installed`);
        }),
        concatMap(app =>
          installApp({ app, addLog, setStep, subscribeProgress }),
        ),
      ),
  );
}

type Step = "start" | "uninstalling" | "installing" | "finished";

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
  logs: Log[],
};

const initialState: State = {
  step: "start",
  error: null,
  logs: [],
  progress: 0,
};

let logId = 0;

const reducer = (
  state: State,
  { type, payload }: { type: TypeAction, payload: any },
) => {
  switch (type) {
    case "ADD_LOG": {
      const log = { id: logId++, date: new Date(), text: payload };
      return { ...state, logs: [...state.logs, log] };
    }
    case "RESET":
      return initialState;
    case "SET_ERROR":
      return { ...state, error: payload };
    case "SET_STEP":
      return { ...state, step: payload };
    case "SET_PROGRESS":
      return { ...state, progress: payload };
    default:
      return state;
  }
};

const provider = 5;
const Update = () => {
  const [state, dispatch] = useReducer<State, Object>(reducer, initialState);
  const { step, error, progress, logs } = state;

  useEffect(() => {
    setEnv("FORCE_PROVIDER", provider);
  });

  const subscribeProgress = stepName => e => {
    if (e.progress === 0) {
      setStep(stepName);
    }
    setProgress(e.progress * 100);
  };

  const addLog = msg => dispatch({ type: "ADD_LOG", payload: msg });
  const setStep = step => dispatch({ type: "SET_STEP", payload: step });
  const setProgress = progress =>
    dispatch({ type: "SET_PROGRESS", payload: progress });

  const setError = err => {
    dispatch({ type: "SET_ERROR", payload: err });
    addLog("An error occured. Stopping.");
  };

  const run = () => {
    const sub = installEverything({
      addLog,
      setStep,
      subscribeProgress,
    }).subscribe({
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

  return (
    <VaultCentered>
      <Box p={30} flow={20} style={{ background: "white" }}>
        <Box flow={10}>
          <Text large bold i18nKey="update:title" />
          <Text i18nKey="update:info" />
        </Box>
        <Text i18nKey="update:plug" />
        <Logs logs={logs} />
        {error ? (
          <>
            <Text color={colors.grenade}>
              <TranslatedError error={error} />
            </Text>
            <Button onClick={retry}>
              <Text i18nKey="update:retry" />
            </Button>
          </>
        ) : step === "osu" ||
          step === "firmware" ||
          step === "install-app" ||
          step === "uninstall-app" ? (
          <ProgressBar indeterminate />
        ) : step === "osu-progress" ||
          step === "firmware-progress" ||
          step === "install-app-progress" ? (
          <ProgressBar progress={progress} />
        ) : step === "finished" ? (
          <Box p={10}>
            <Text i18nKey="update:success" />
          </Box>
        ) : (
          <Button variant="filled" customColor={colors.blue} onClick={run}>
            <Text i18nKey="update:update" />
          </Button>
        )}
      </Box>
    </VaultCentered>
  );
};

export default Update;
