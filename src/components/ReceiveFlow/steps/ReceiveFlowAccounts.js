// @flow

import React from "react";

import SelectAccount from "components/SelectAccount";

import type { Account } from "data/types";
import type { ReceiveFlowStepProps } from "../types";

export default (props: ReceiveFlowStepProps) => {
  const { payload, accounts } = props;

  const onSelect = (account: ?Account) => {
    if (!account) return;
    const { updatePayload, transitionTo } = props;
    updatePayload(
      {
        selectedAccount: account,
        isOnVaultApp: false,
        isAddressVerified: false,
      },
      () => transitionTo("device"),
    );
  };
  const formattedAccounts = accounts.edges.map(el => el.node);
  return (
    <SelectAccount
      accounts={formattedAccounts}
      value={payload.selectedAccount}
      onChange={onSelect}
      autoFocus
      openMenuOnFocus
    />
  );
};
