// @flow

import React, { PureComponent } from "react";
import connectData from "restlay/connectData";

import AccountsQuery from "api/queries/AccountsQuery";

import SelectAccount from "components/SelectAccount";
import Box from "components/base/Box";

import type { Account } from "data/types";
import type { Connection } from "restlay/ConnectionQuery";
import type { ReceiveFlowPayload } from "../types";

type Props = {
  payload: ReceiveFlowPayload,
  updatePayload: ($Shape<ReceiveFlowPayload>) => void,
  accounts: Connection<Account>,
};
class ReceiveFlowAccounts extends PureComponent<Props> {
  onSelect = (account: ?Account) => {
    if (!account) return;
    const { updatePayload } = this.props;
    updatePayload({
      selectedAccount: account,
      isOnVaultApp: false,
      isAddressVerified: false,
    });
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
