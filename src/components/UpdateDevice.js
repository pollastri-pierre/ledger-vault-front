// @flow
import React, { useState, useMemo } from "react";
import uniq from "lodash/uniq";
import { from, Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { withDevicePolling } from "@ledgerhq/live-common/lib/hw/deviceAccess";
import { Trans } from "react-i18next";
import { MdClose } from "react-icons/md";
import getDeviceInfo from "@ledgerhq/live-common/lib/hw/getDeviceInfo";

import Select from "components/base/Select";
import TranslatedError from "components/TranslatedError";
import colors from "shared/colors";
import type { FirmDevice } from "components/Updater";
import { FIRMWARE_TRANSITIONS_RAW, APPS_RAW } from "device/update/data";
import { remapError } from "utils/errors";
import * as registry from "device/update/registry";
import VaultCentered from "components/VaultCentered";
import Box from "components/base/Box";
import Text from "components/base/Text";
import Card from "components/base/Card";
import Button from "components/base/Button";
import Updater from "components/Updater";

export const withDeviceInfo: Observable<*> = withDevicePolling("webusb")(
  transport => from(getDeviceInfo(transport)),
  () => {
    return false;
  },
);
export const transitions = FIRMWARE_TRANSITIONS_RAW.map(
  registry.parseRawTransition,
);
const apps = APPS_RAW.map(registry.parseRawApp);
const uniqueAppVersions = uniq(apps.map(a => a.version));
const appsOptions = uniqueAppVersions.map(v => ({
  label: v,
  value: v,
  data: v,
}));
const uniqueFirmwareVersions = uniq([
  ...transitions.map(t => t.from.version),
  ...transitions.map(t => t.to.version),
]);
uniqueFirmwareVersions.sort().reverse();
uniqueAppVersions.sort().reverse();

const firmwaresOptions = uniqueFirmwareVersions.map(v => ({
  label: v,
  value: v,
  data: v,
}));

type State = {
  currentFirmware: ?FirmDevice,
  expectedApp: string,
  error: ?Error,
  loading: boolean,
  advancedMode: boolean,
};
const UpdateDevice = () => {
  const initialState = {
    currentFirmware: null,
    expectedApp: window.config.APP_VERSION,
    error: null,
    loading: false,
    advancedMode: false,
  };
  const [state, setState] = useState<State>(initialState);
  const currentFirmwareOption = useMemo(() => {
    const { currentFirmware } = state;
    if (!currentFirmware) return null;
    const option = firmwaresOptions.find(
      o => o.value === currentFirmware.version,
    );
    return option;
  }, [state.currentFirmware]);

  const expectedVersionOption = useMemo(
    () => appsOptions.find(o => o.value === state.expectedApp),
    [state.expectedApp],
  );
  const connectDevice = () => {
    setState({ ...state, error: null, loading: true });
    withDeviceInfo
      .pipe(
        catchError(error => {
          setState({ ...state, error: remapError(error), loading: false });
          return throwError(error);
        }),
      )
      .subscribe(d => {
        setState({ ...state, currentFirmware: d, loading: false });
      });
  };

  const setAdvancedMode = () =>
    setState({ ...state, advancedMode: !state.advancedMode });

  const handleChooseExpectedVersion = o =>
    setState({ ...state, expectedApp: o.value });

  const handleChooseCurrentFirmware = o => {
    setState({
      ...state,
      currentFirmware: { version: o.value },
    });
  };

  const { error, advancedMode, loading } = state;
  return (
    <VaultCentered noVerticalAlign>
      {state.currentFirmware ? (
        <Card flow={20}>
          <Box flow={20}>
            <Updater
              expectedApp={state.expectedApp}
              currentFirmware={state.currentFirmware}
              transitions={transitions}
              apps={apps}
            />
            {advancedMode ? (
              <Box
                align="center"
                horizontal
                flow={30}
                p={20}
                style={{ background: colors.legacyLightGrey5, borderRadius: 4 }}
              >
                <Box align="center" horizontal flow={5}>
                  <span>Current firm version:</span>
                  <Box width={120}>
                    <Select
                      value={currentFirmwareOption}
                      onChange={handleChooseCurrentFirmware}
                      options={firmwaresOptions}
                    />
                  </Box>
                </Box>
                <Box align="center" horizontal flow={5}>
                  <span>Expected app version:</span>
                  <Box width={120}>
                    <Select
                      value={expectedVersionOption}
                      onChange={handleChooseExpectedVersion}
                      options={appsOptions}
                    />
                  </Box>
                </Box>
                <Box>
                  <Button
                    type="link"
                    size="small"
                    data-test="delete_edit"
                    onClick={setAdvancedMode}
                  >
                    <MdClose size={13} />
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box alignSelf="flex-end">
                <Button type="link" size="small" onClick={setAdvancedMode}>
                  Advanced mode
                </Button>
              </Box>
            )}
          </Box>
        </Card>
      ) : (
        <Card flow={20} align="center" justify="center" width={540}>
          <Text size="large" fontWeight="bold" i18nKey="update:title" />
          <UserExplanation />
          <Box flow={5} align="center">
            <Button
              size="small"
              type="filled"
              onClick={connectDevice}
              isLoadingProp={loading}
            >
              <Text i18nKey="update:update" />
            </Button>
            {error && error.message && (
              <Text color="red">
                <TranslatedError error={error} field="description" />
              </Text>
            )}
          </Box>
        </Card>
      )}
    </VaultCentered>
  );
};

export default UpdateDevice;

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
