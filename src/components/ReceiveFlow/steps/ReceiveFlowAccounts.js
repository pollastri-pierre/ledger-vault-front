// @flow

import React, { PureComponent } from "react";
import connectData from "restlay/connectData";

import AccountsQuery from "api/queries/AccountsQuery";

import SelectAccount from "components/SelectAccount";
import Box from "components/base/Box";

import type { Account } from "data/types";
import type { Connection } from "restlay/ConnectionQuery";
import type { ReceiveFlowStepProps } from "../types";

type Props = ReceiveFlowStepProps & {
  accounts: Connection<Account>,
};

class ReceiveFlowAccounts extends PureComponent<Props> {
  onSelect = (account: ?Account) => {
    if (!account) return;
    const { updatePayload, transitionTo } = this.props;
    updatePayload(
      {
        selectedAccount: account,
        isOnVaultApp: false,
        isAddressVerified: false,
      },
      () => transitionTo("device"),
    );
  };

  render() {
    const { accounts, payload } = this.props;
    const formattedAccounts = accounts.edges.map(e => e.node);

    return (
      <Box>
        <SelectAccount
          accounts={formattedAccounts.filter(
            a => a.status === "APPROVED" || a.status === "VIEW_ONLY",
          )}
          value={payload.selectedAccount}
          onChange={this.onSelect}
          autoFocus
          openMenuOnFocus
        />
      </Box>
    );
  }
}

export default connectData(ReceiveFlowAccounts, {
  queries: {
    accounts: AccountsQuery,
  },
});
