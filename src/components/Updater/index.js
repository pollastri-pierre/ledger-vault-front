// @flow

import React, { useMemo } from "react";

import { getUpdatePlan } from "device/update/registry";
import InfoBox from "components/base/InfoBox";
import type { VaultFirmwareTransition, VaultApp } from "device/update/registry";

import UpdatePlan from "./UpdatePlan";

export type FirmDevice = {
  version: string,
  isOSU?: boolean,
};
type Props = {
  expectedApp: string,
  currentFirmware: FirmDevice,
  transitions: VaultFirmwareTransition[],
  apps: VaultApp[],
  isDemoMode?: boolean,
};

const Updater = (props: Props) => {
  const { expectedApp, currentFirmware, transitions, apps, isDemoMode } = props;

  const plan = useMemo(() => {
    try {
      return getUpdatePlan({
        expectedApp,
        currentFirmware: currentFirmware.version,
        transitions,
        apps,
        isOSU: currentFirmware.isOSU,
      });
    } catch (e) {
      return null;
    }
  }, [expectedApp, currentFirmware, transitions, apps]);

  return plan ? (
    <UpdatePlan
      plan={plan}
      currentFirmware={currentFirmware}
      isDemoMode={isDemoMode}
    />
  ) : (
    <InfoBox type="error">
      <div>
        Could not find any available firmware transition that can be installed
        on <strong>{currentFirmware.version}</strong> and that support app{" "}
        <strong>{expectedApp}</strong>
      </div>
    </InfoBox>
  );
};

export default Updater;
