// @flow

import React, { PureComponent } from "react";

import MUITable from "@material-ui/core/Table";
import MUITableBody from "@material-ui/core/TableBody";
import MUITableCell from "@material-ui/core/TableCell";
import MUITableHead from "@material-ui/core/TableHead";
import MUITableRow from "@material-ui/core/TableRow";

import CounterValue from "components/CounterValue";
import AccountName from "components/AccountName";
import AccountStatus from "components/AccountStatus";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import NoDataPlaceholder from "components/NoDataPlaceholder";

import type { Account } from "data/types";

type Props = {
  accounts: Account[],
  onAccountClick: Account => void
};

class AccountsTable extends PureComponent<Props> {
  Account = (account: Account) => {
    const { onAccountClick } = this.props;
    return (
      <AccountRow key={account.id} account={account} onClick={onAccountClick} />
    );
  };

  render() {
    const { accounts } = this.props;

    if (!accounts.length) {
      return <NoDataPlaceholder title="No accounts" />;
    }

    return (
      <MUITable>
        <AccountsTableHeader />
        <MUITableBody>{accounts.map(this.Account)}</MUITableBody>
      </MUITable>
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
  account: Account,
  onClick: Account => void
};

const accountRowHover = { cursor: "pointer" };

class AccountRow extends PureComponent<AccountRowProps> {
  handleClick = () => {
    this.props.onClick(this.props.account);
  };

  render() {
    const { account, onClick } = this.props;

    return (
      <MUITableRow
        key={account.id}
        hover={!!onClick}
        style={onClick ? accountRowHover : undefined}
        onClick={onClick ? this.handleClick : undefined}
      >
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
