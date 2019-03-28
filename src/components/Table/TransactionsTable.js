// @flow

import React, { PureComponent } from "react";

import MUITable from "@material-ui/core/Table";
import MUITableBody from "@material-ui/core/TableBody";
import MUITableCell from "@material-ui/core/TableCell";
import MUITableHead from "@material-ui/core/TableHead";
import MUITableRow from "@material-ui/core/TableRow";

import Text from "components/base/Text";
import CounterValue from "components/CounterValue";
import DateFormat from "components/DateFormat";
import AccountName from "components/AccountName";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import NoDataPlaceholder from "components/NoDataPlaceholder";
import TransactionStatus from "components/TransactionStatus";

import type { Account, Transaction } from "data/types";

import TableScroll from "./TableScroll";

type Props = {
  data: Transaction[],
  onRowClick: Transaction => void,
  accounts: Account[],

  // additional fields
  withStatus?: boolean,
  withLabel?: boolean,
};

class TransactionsTable extends PureComponent<Props> {
  Transaction = (transaction: Transaction) => {
    const { accounts, onRowClick, withStatus, withLabel } = this.props;

    const account = accounts.find(
      account => account.id === transaction.account_id,
    );

    if (!account) {
      return null;
    }

    const key = `${transaction.account_id}-${transaction.id}-${
      transaction.type
    }`;

    return (
      <TransactionRow
        key={key}
        transaction={transaction}
        account={account}
        onClick={onRowClick}
        withStatus={withStatus}
        withLabel={withLabel}
      />
    );
  };

  render() {
    const { data, withStatus, withLabel } = this.props;

    if (!data.length) {
      return <NoDataPlaceholder title="No transactions found." />;
    }

    return (
      <TableScroll>
        <MUITable>
          <TransactionsTableHeader
            withStatus={withStatus}
            withLabel={withLabel}
          />
          <MUITableBody>{data.map(this.Transaction)}</MUITableBody>
        </MUITable>
      </TableScroll>
    );
  }
}

type TransactionsTableHeaderProps = {
  withStatus?: boolean,
  withLabel?: boolean,
};

class TransactionsTableHeader extends PureComponent<TransactionsTableHeaderProps> {
  render() {
    const { withStatus, withLabel } = this.props;
    return (
      <MUITableHead>
        <MUITableRow>
          <MUITableCell>Date</MUITableCell>
          <MUITableCell>Account</MUITableCell>
          {withStatus && <MUITableCell>Status</MUITableCell>}
          {withLabel && <MUITableCell>Label</MUITableCell>}
          <MUITableCell />
          <MUITableCell align="right">Amount</MUITableCell>
        </MUITableRow>
      </MUITableHead>
    );
  }
}

type TransactionRowProps = {
  transaction: Transaction,
  account: Account,
  onClick: Transaction => void,

  // additional fields
  withStatus?: boolean,
  withLabel?: boolean,
};

const transactionRowHover = { cursor: "pointer" };

class TransactionRow extends PureComponent<TransactionRowProps> {
  handleClick = () => {
    this.props.onClick(this.props.transaction);
  };

  render() {
    const { transaction, account, onClick, withStatus, withLabel } = this.props;

    const amount =
      transaction.amount || (transaction.price && transaction.price.amount);

    const note = transaction.notes && transaction.notes[0];

    return (
      <MUITableRow
        hover={!!onClick}
        style={onClick ? transactionRowHover : undefined}
        onClick={onClick ? this.handleClick : undefined}
      >
        <MUITableCell>
          <DateFormat format="ddd D MMM, h:mmA" date={transaction.created_on} />
        </MUITableCell>

        <MUITableCell>
          <AccountName account={account} />
        </MUITableCell>

        {withStatus && (
          <MUITableCell>
            <TransactionStatus transaction={transaction} />
          </MUITableCell>
        )}

        {withLabel && <MUITableCell>{note ? note.content : ""}</MUITableCell>}

        <MUITableCell align="right">
          <CounterValue
            from={account.currency}
            value={amount}
            alwaysShowSign
            disableCountervalue={account.account_type === "ERC20"}
            type={transaction.type}
          />
        </MUITableCell>

        <MUITableCell align="right">
          <Text bold={transaction.type === "RECEIVE"}>
            <CurrencyAccountValue
              account={account}
              value={amount}
              erc20Format={account.account_type === "ERC20"}
              type={transaction.type}
              alwaysShowSign
            />
          </Text>
        </MUITableCell>
      </MUITableRow>
    );
  }
}

export default TransactionsTable;
