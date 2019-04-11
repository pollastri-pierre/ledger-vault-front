// @flow

import React, { PureComponent } from "react";
import connectData from "restlay/connectData";

import AccountsQuery from "api/queries/AccountsQuery";

import SelectAccount from "components/SelectAccount";

import type { Account } from "data/types";
import type { ReceiveFlowPayload } from "../types";

type Props = {
  payload: ReceiveFlowPayload,
  updatePayload: *,
  accounts: *,
};
class ReceiveFlowAccounts extends PureComponent<Props> {
  onSelect = (account: ?Account) => {
    const { updatePayload } = this.props;
    updatePayload({ selectedAccount: account });
  };

  render() {
    const { accounts, payload } = this.props;
    const formattedAccounts = accounts.edges.map(e => e.node);

    return (
      <div>
        <SelectAccount
          accounts={formattedAccounts.filter(
            a => a.status === "APPROVED" || a.status === "VIEW_ONLY",
          )}
          value={payload.selectedAccount}
          onChange={this.onSelect}
          autoFocus
          openMenuOnFocus
        />
      </div>
    );
  }
}

export default connectData(ReceiveFlowAccounts, {
  queries: {
    accounts: AccountsQuery,
  },
});
