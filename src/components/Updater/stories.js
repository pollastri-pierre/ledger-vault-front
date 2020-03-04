import React, { useState, useMemo } from "react";
import { storiesOf } from "@storybook/react";
import { boolean } from "@storybook/addon-knobs";
import { from } from "rxjs";
import uniq from "lodash/uniq";
import getDeviceInfo from "@ledgerhq/live-common/lib/hw/getDeviceInfo";
import {
  withDevicePolling,
  genericCanRetryOnError,
} from "@ledgerhq/live-common/lib/hw/deviceAccess";

import { FIRMWARE_TRANSITIONS_RAW, APPS_RAW } from "device/update/data";
import * as registry from "device/update/registry";

import pageDecorator from "stories/pageDecorator";
import Box from "components/base/Box";
import Text from "components/base/Text";
import Select from "components/base/Select";
import Card from "components/base/Card";
import Button from "components/base/Button";
import Updater from "./index";

const apps = APPS_RAW.map(registry.parseRawApp);
const transitions = FIRMWARE_TRANSITIONS_RAW.map(registry.parseRawTransition);
const uniqueFirmwareVersions = uniq([
  ...transitions.map(t => t.from.version),
  ...transitions.map(t => t.to.version),
]);
uniqueFirmwareVersions.sort().reverse();
const uniqueAppVersions = uniq(apps.map(a => a.version));
uniqueAppVersions.sort().reverse();

const appsOptions = uniqueAppVersions.map(v => ({ label: v, value: v }));
const firmwaresOptions = uniqueFirmwareVersions.map(v => ({
  label: v,
  value: v,
}));

export const withDeviceInfo = withDevicePolling("webusb")(
  transport => from(getDeviceInfo(transport)),
  err => {
    // $FlowFixMe
    if (err.statusCode === 0x6020) {
      return false;
    }
    return genericCanRetryOnError(err);
  },
);

storiesOf("components", module)
  .addDecorator(pageDecorator)
  .add("Updater", () => <Wrapper />);

export const Wrapper = () => {
  const initialState = { currentFirmware: null, expectedApp: "3.0.9" };
  const [state, setState] = useState(initialState);

  const connectDevice = () => {
    withDeviceInfo.subscribe(d => {
      setState({ ...state, currentFirmware: d });
    });
  };
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

  const handleChooseCurrentFirmware = o => {
    setState({
      ...state,
      currentFirmware: { version: o.value },
    });
  };

  const resetState = () => setState(initialState);

  const handleChooseExpectedVersion = o =>
    setState({ ...state, expectedApp: o.value });
  const isDevice = boolean("with device", false);
  return (
    <Box flow={20}>
      <Box align="center" horizontal flow={30}>
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
          <Button size="small" onClick={resetState}>
            clear
          </Button>
        </Box>
      </Box>
      <Card>
        {state.currentFirmware ? (
          <Updater
            expectedApp={state.expectedApp}
            currentFirmware={state.currentFirmware}
            transitions={transitions}
            apps={apps}
            isDemoMode={!isDevice}
          />
        ) : (
          <Box width={400} flow={20}>
            <Text i18nKey="update:info" />
            <Box width={200}>
              <Button size="small" type="filled" onClick={connectDevice}>
                <Text i18nKey="update:update" />
              </Button>
            </Box>
          </Box>
        )}
      </Card>
    </Box>
  );
};
