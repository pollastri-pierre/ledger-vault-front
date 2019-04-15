// @flow

import React from "react";
import { FaUser } from "react-icons/fa";
import { Trans } from "react-i18next";
import connectData from "restlay/connectData";

import MultiStepsFlow from "components/base/MultiStepsFlow";
import colors from "shared/colors";
import { ModalFooterButton } from "components/base/Modal";

import ReceiveFlowAccounts from "./steps/ReceiveFlowAccounts";
import ReceiveFlowDevice from "./steps/ReceiveFlowDevice";
import ReceiveFlowConfirmation from "./steps/ReceiveFlowConfirmation";

import type { ReceiveFlowPayload } from "./types";

const initialPayload = {
  selectedAccount: null,
  isOnVaultApp: false,
  isAddressVerified: false,
};

const steps = [
  {
    id: "accounts",
    name: "Accounts",
    Step: ReceiveFlowAccounts,
  },
  {
    id: "device",
    name: "Device",
    Step: ReceiveFlowDevice,
    requirements: (payload: ReceiveFlowPayload) => {
      return !!payload.selectedAccount;
    },
  },
  {
    id: "confirm",
    name: "Confirmation",
    Step: ReceiveFlowConfirmation,
    requirements: (payload: ReceiveFlowPayload) => {
      return !!payload.isOnVaultApp;
    },
    Cta: ({
      payload,
      transitionTo,
      updatePayload,
    }: {
      payload: ReceiveFlowPayload,
      transitionTo: string => void,
      updatePayload: ($Shape<ReceiveFlowPayload>) => void,
    }) => {
      return (
        <ModalFooterButton
          color={colors.ocean}
          isDisabled={!payload.isAddressVerified}
          onClick={() => {
            // $FlowFixMe
            updatePayload(initialPayload);
            transitionTo("accounts");
          }}
        >
          <Trans i18nKey="receive:receive_again" />
        </ModalFooterButton>
      );
    },
  },
];

const title = "Receive";

const styles = {
  container: { minHeight: 670 },
};

function ReceiveFlow(props: { close: () => void }) {
  return (
    <MultiStepsFlow
      Icon={FaUser}
      title={title}
      initialPayload={initialPayload}
      // $FlowFixMe
      steps={steps}
      style={styles.container}
      onClose={props.close}
    />
  );
}

export default connectData(ReceiveFlow);
