// @flow
import React, { useState, useReducer } from "react";
import styled from "styled-components";
import manager from "@ledgerhq/live-common/lib/manager";
import { DiApple, DiWindows, DiLinux } from "react-icons/di";
import live_installApp from "@ledgerhq/live-common/lib/hw/installApp";
import live_uninstallApp from "@ledgerhq/live-common/lib/hw/uninstallApp";
import TransportUSB from "@ledgerhq/hw-transport-webusb";
import TranslatedError from "components/TranslatedError";
import { withDevicePolling } from "@ledgerhq/live-common/lib/hw/deviceAccess";
import getDeviceInfo from "@ledgerhq/live-common/lib/hw/getDeviceInfo";
import VaultCentered from "components/VaultCentered";
import { from, of, concat, throwError, combineLatest } from "rxjs";
import { concatMap, tap, delay, catchError, map } from "rxjs/operators";

import { Trans } from "react-i18next";
import colors from "shared/colors";
import { urls } from "utils/urls";
import Box from "components/base/Box";
import Button from "components/base/Button";
import ProgressBar from "components/base/ProgressBar";
import InfoBox from "components/base/InfoBox";
import Text from "components/base/Text";

const DEV_MODE = true;

const APP_SETTINGS = {
  install: {
    targetId: 0x31010004,
    perso: "perso_11",
    delete_key: "blue/2.2.4-ee/vault/app_del_key",
    firmware: "blue/2.2.4-ee/vault/app_2.0.6",
    firmware_key: "blue/2.2.4-ee/vault/app_2.0.6_key",
  },
  uninstall: {
    targetId: 0x31010004,
    perso: "perso_11",
    delete: "blue/2.1.1-ee/vault3/app_del",
    delete_key: "blue/2.1.1-ee/vault3/app_del_key",
  },
};
const getTransport = async () => {
  const transport = await TransportUSB.create();
  return transport;
};

export function installApp({ addLog, setStep, subscribeProgress }) {
  return from(getTransport()).pipe(
    concatMap(transport =>
      concat(
        of(null).pipe(tap(() => console.log("tranport created"))),
        from(getDeviceInfo(transport)).pipe(
          concatMap(infos =>
            concat(
              of(null).pipe(tap(() => setStep("uninstalling"))),
              live_uninstallApp(
                transport,
                infos.targetId,
                APP_SETTINGS.uninstall,
              ),
              of(null).pipe(tap(() => console.log("uninstall finished"))),
              live_installApp(
                transport,
                infos.targetId,
                APP_SETTINGS.install,
              ).pipe(tap(subscribeProgress("install-app-progress"))),
            ),
          ),
        ),
      ),
    ),
  );
}

type Step = "start" | "uninstalling" | "installing" | "finished";

type State = {
  step: Step,
  error?: Error,
  progress: number,
};

const initialState: State = {
  step: "start",
  error: null,
  progress: 0,
};

const reducer = (state, { type, payload }) => {
  switch (type) {
    case "SET_ERROR":
      return { ...state, error: payload };
    case "SET_STEP":
      return { ...state, step: payload };
    case "SET_PROGRESS":
      return { ...state, progress: payload };
  }
};

const Update = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const subscribeProgress = stepName => e => {
    if (e.progress === 0) {
      setStep(stepName);
    }
    console.log(e);
    setProgress(e.progress * 100);
  };

  const addLog = msg => {
    console.log(msg);
  };
  const setStep = step => dispatch({ type: "SET_STEP", payload: step });
  const setProgress = progress =>
    dispatch({ type: "SET_PROGRESS", payload: progress });

  const setError = err => {
    console.log(err);
    dispatch({ type: "SET_ERROR", payload: err });
    addLog("An error occured. Stopping.");
  };

  const run = () => {
    const sub = installApp({
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

  return (
    <VaultCentered>
      <Box p={20} width={500} flow={20}>
        <Text large bold>
          Install latest app
        </Text>
        <Text>
          We detected that your are not running the latest version of the blue
          vault app. Please update it before using the vault
        </Text>
        <Text>
          Plug your device and enter your pin code and click on install app
        </Text>
        {state.error && (
          <Text color="red">
            <TranslatedError error={state.error} />
          </Text>
        )}
        {state.step === "start" && (
          <Button variant="text" type="submit" onClick={run}>
            install app
          </Button>
        )}
        {state.step === "install-app" && <ProgressBar indeterminate />}
        {state.step === "install-app-progress" && (
          <ProgressBar progres={state.progress} />
        )}
      </Box>
    </VaultCentered>
  );
};

export default Update;
