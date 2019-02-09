// @flow

import React, { PureComponent } from "react";

import MUITableBody from "@material-ui/core/TableBody";
import MUITableCell from "@material-ui/core/TableCell";
import MUITableHead from "@material-ui/core/TableHead";
import MUITableRow from "@material-ui/core/TableRow";

import CounterValue from "components/CounterValue";
import AccountName from "components/AccountName";
import AccountStatus from "components/AccountStatus";
import CurrencyAccountValue from "components/CurrencyAccountValue";

import type { Account } from "data/types";
import TableBase from "./base";

type Props = {
  accounts: Account[]
};

class AccountsTable extends PureComponent<Props> {
  Account = (account: Account) => (
    <AccountRow key={account.id} account={account} />
  );

  render() {
    const { accounts } = this.props;
    return (
      <TableBase>
        <AccountsTableHeader />
        <MUITableBody>{accounts.map(this.Account)}</MUITableBody>
      </TableBase>
    );
  }
}

type AccountsTableHeaderProps = {};

class AccountsTableHeader extends PureComponent<AccountsTableHeaderProps> {
  render() {
    return (
      <MUITableHead>
        <MUITableRow>
          <MUITableCell>Name</MUITableCell>
          <MUITableCell>Status</MUITableCell>
          <MUITableCell />
          <MUITableCell numeric>Balance</MUITableCell>
        </MUITableRow>
      </MUITableHead>
    );
  }
}

type AccountRowProps = {
  account: Account
};

class AccountRow extends PureComponent<AccountRowProps> {
  render() {
    const { account } = this.props;

    return (
      <MUITableRow key={account.id}>
        <MUITableCell>
          <AccountName account={account} />
        </MUITableCell>

        <MUITableCell>
          <AccountStatus account={account} />
        </MUITableCell>

        <MUITableCell numeric>
          <CounterValue
            from={account.currency_id}
            value={account.balance}
            alwaysShowSign
            disableCountervalue={account.account_type === "ERC20"}
          />
        </MUITableCell>

        <MUITableCell numeric>
          <CurrencyAccountValue
            account={account}
            value={account.balance}
            erc20Format={account.account_type === "erc20"}
          />
        </MUITableCell>
      </MUITableRow>
    );
  }
}

export default AccountsTable;
