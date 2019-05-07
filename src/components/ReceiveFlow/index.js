// @flow

import React from "react";
import { FaUser } from "react-icons/fa";
import { Trans } from "react-i18next";
import connectData from "restlay/connectData";

import MultiStepsFlow from "components/base/MultiStepsFlow";
import colors from "shared/colors";
import { ModalFooterButton } from "components/base/Modal";
import AccountsQuery from "api/queries/AccountsQuery";
import { CardError } from "components/base/Card";
import GrowingCard, { GrowingSpinner } from "components/base/GrowingCard";

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
      transitionTo?: string => void,
      updatePayload?: ($Shape<ReceiveFlowPayload>) => void,
    }) => {
      return (
        <ModalFooterButton
          color={colors.ocean}
          isDisabled={!payload.isAddressVerified}
          onClick={() => {
            updatePayload && updatePayload(initialPayload);
            transitionTo && transitionTo("accounts");
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

export default connectData(
  props => {
    const { match, accounts } = props;
    let payload = initialPayload;
    let cursor = 0;
    if (match.params && match.params.id) {
      const selectedAccount = accounts.edges
        .map(e => e.node)
        .find(a => a.id === parseInt(match.params.id, 10));

      if (selectedAccount) {
        cursor = 1;
        payload = { ...initialPayload, selectedAccount };
      }
    }
    return (
      <GrowingCard>
        <MultiStepsFlow
          Icon={FaUser}
          title={title}
          initialPayload={payload}
          additionalProps={props}
          steps={steps}
          style={styles.container}
          initialCursor={cursor}
          onClose={props.close}
        />
      </GrowingCard>
    );
  },
  {
    RenderLoading: GrowingSpinner,
    RenderError: CardError,
    queries: {
      accounts: AccountsQuery,
    },
  },
);
