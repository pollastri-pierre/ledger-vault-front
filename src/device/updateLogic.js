// @flow

import manager from "@ledgerhq/live-common/lib/manager";
import { Observable } from "rxjs/Observable";
import live_installApp from "@ledgerhq/live-common/lib/hw/installApp";
import live_uninstallApp from "@ledgerhq/live-common/lib/hw/uninstallApp";
import firmwareUpdatePrepare from "@ledgerhq/live-common/lib/hw/firmwareUpdate-prepare";
import firmwareUpdateMain from "@ledgerhq/live-common/lib/hw/firmwareUpdate-main";
import {
  withDevicePolling,
  genericCanRetryOnError,
} from "@ledgerhq/live-common/lib/hw/deviceAccess";
import getDeviceInfo from "@ledgerhq/live-common/lib/hw/getDeviceInfo";
import { concatMap, tap, delay, catchError } from "rxjs/operators";
import { from, of, concat, throwError, combineLatest } from "rxjs";
import type { Step } from "components/UpdateApp";

const ALREADY_UP_TO_DATE = "Firmware is already up-to-date.";
export const withDeviceInfo: Observable<*> = withDevicePolling("")(
  transport => from(getDeviceInfo(transport)),
  err => {
    // $FlowFixMe
    if (err.statusCode === 0x6020) {
      return false;
    }
    return genericCanRetryOnError(err);
  },
);

const APP_SETTINGS = {
  uninstall: {
    targetId: 0x31010004,
    perso: "perso_11",
    delete: "blue/2.1.1-ee/vault3/app_del",
    delete_key: "blue/2.1.1-ee/vault3/app_del_key",
  },
};

export function installApp({
  app,
  addLog,
  setStep,
  subscribeProgress,
}: {
  app: Object,
  addLog: Object => void,
  setStep: Step => void,
  subscribeProgress: Step => (e: { progress: number }) => void,
}): Observable<*> {
  return withDevicePolling("")(
    transport => {
      return from(getDeviceInfo(transport)).pipe(
        concatMap(infos =>
          concat(
            of(null).pipe(
              tap(() => {
                setStep("uninstall-app");
                addLog("Uninstalling current app...");
              }),
            ),
            live_uninstallApp(
              transport,
              infos.targetId,
              // $FlowFixMe
              APP_SETTINGS.uninstall,
            ),
            of(null).pipe(
              tap(() => {
                addLog("Uninstalling complete");
                addLog("Installing latest Vault app... please wait...");
              }),
            ),
            live_installApp(transport, infos.targetId, app).pipe(
              tap(subscribeProgress("install-app-progress")),
            ),
            of(null).pipe(
              tap(() => {
                addLog("Installing complete");
              }),
            ),
          ),
        ),
      );
    },
    () => false,
  );
}

export function installFirmware({
  addLog,
  setStep,
  subscribeProgress,
}: {
  addLog: Object => void,
  setStep: Step => void,
  subscribeProgress: Step => (e: { progress: number }) => void,
}): Observable<*> {
  addLog("Fetching latest firmware...");
  const installSub = withDeviceInfo.pipe(
    concatMap(infos =>
      combineLatest(
        of(infos),
        from(manager.getLatestFirmwareForDevice(infos)).pipe(
          catchError(err => {
            if (err.isAxiosError && err.response.status === 404) {
              return throwError(new Error("No firmware found."));
            }
            return throwError(err);
          }),
        ),
      ),
    ),
    concatMap(([infos, latestFirmware]) => {
      if (!latestFirmware) {
        return throwError(new Error(ALREADY_UP_TO_DATE));
      }
      return infos.isOSU
        ? concat(
            of(null).pipe(
              tap(() => {
                setStep("firmware");
                addLog("Installing final firmware...");
              }),
            ),
            firmwareUpdateMain("", latestFirmware).pipe(
              tap(subscribeProgress("firmware-progress")),
            ),
          )
        : concat(
            of(null).pipe(
              tap(() => {
                setStep("osu");
                addLog("Installing OS updater...");
                addLog("Please allow Ledger Manager on your device.");
              }),
            ),
            firmwareUpdatePrepare("", latestFirmware).pipe(
              tap(subscribeProgress("osu-progress")),
            ),
            of(null).pipe(
              tap(() => {
                addLog("Waiting for device to reboot...");
              }),
            ),
            of(delay(2000)),
            installSub,
          );
    }),
  );

  return installSub;
}
