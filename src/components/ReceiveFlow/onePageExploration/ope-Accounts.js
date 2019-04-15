// @flow

import React, { PureComponent } from "react";
import connectData from "restlay/connectData";

import AccountsQuery from "api/queries/AccountsQuery";

import SelectAccount from "components/SelectAccount";

import type { Account } from "data/types";
import type { Connection } from "restlay/ConnectionQuery";

type Props = {
  updateState: ($Shape<*>) => void,
  accounts: Connection<Account>,
  reInit: () => void,
  selectedAccount: Account,
};

class Accounts extends PureComponent<Props> {
  onSelect = (account: ?Account) => {
    const { updateState } = this.props;
    updateState({ selectedAccount: account, displayQRcode: true });
  };

  render() {
    const { accounts, selectedAccount, reInit } = this.props;
    const formattedAccounts = accounts.edges.map(e => e.node);

    return (
      <div>
        <SelectAccount
          accounts={formattedAccounts.filter(
            a => a.status === "APPROVED" || a.status === "VIEW_ONLY",
          )}
          value={selectedAccount}
          onChange={this.onSelect}
          onMenuOpen={reInit}
          autoFocus
          openMenuOnFocus
        />
      </div>
    );
  }
}

export default connectData(Accounts, {
  queries: {
    accounts: AccountsQuery,
  },
});
