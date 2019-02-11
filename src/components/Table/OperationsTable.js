// @flow

import React, { PureComponent } from "react";

import MUITableBody from "@material-ui/core/TableBody";
import MUITableCell from "@material-ui/core/TableCell";
import MUITableHead from "@material-ui/core/TableHead";
import MUITableRow from "@material-ui/core/TableRow";

import Text from "components/base/Text";
import CounterValue from "components/CounterValue";
import DateFormat from "components/DateFormat";
import AccountName from "components/AccountName";
import CurrencyAccountValue from "components/CurrencyAccountValue";

import type { Account, Operation } from "data/types";
import TableBase from "./base";

type Props = {
  operations: Operation[],
  accounts: Account[]
};

class OperationsTable extends PureComponent<Props> {
  Operation = (operation: Operation) => {
    const { accounts } = this.props;
    return (
      <OperationRow
        key={operation.id}
        operation={operation}
        accounts={accounts}
      />
    );
  };

  render() {
    const { operations } = this.props;
    return (
      <TableBase>
        <OperationsTableHeader />
        <MUITableBody>{operations.map(this.Operation)}</MUITableBody>
      </TableBase>
    );
  }
}

type OperationsTableHeaderProps = {};

class OperationsTableHeader extends PureComponent<OperationsTableHeaderProps> {
  render() {
    return (
      <MUITableHead>
        <MUITableRow>
          <MUITableCell>Date</MUITableCell>
          <MUITableCell>Account</MUITableCell>
          <MUITableCell />
          <MUITableCell numeric>Amount</MUITableCell>
        </MUITableRow>
      </MUITableHead>
    );
  }
}

type OperationRowProps = {
  operation: Operation,
  accounts: Account[]
};

class OperationRow extends PureComponent<OperationRowProps> {
  render() {
    const { operation, accounts } = this.props;

    const account = accounts.find(
      account => account.id === operation.account_id
    );

    if (!account) {
      return null;
    }

    const amount =
      operation.amount || (operation.price && operation.price.amount);

    return (
      <MUITableRow key={operation.id} hover style={{ cursor: "pointer" }}>
        <MUITableCell>
          <DateFormat format="ddd D MMM, h:mmA" date={operation.created_on} />
        </MUITableCell>

        <MUITableCell>
          <AccountName account={account} />
        </MUITableCell>

        <MUITableCell numeric>
          <CounterValue
            from={account.currency_id}
            value={amount}
            alwaysShowSign
            disableCountervalue={account.account_type === "ERC20"}
            type={operation.type}
          />
        </MUITableCell>

        <MUITableCell numeric>
          <Text bold={operation.type === "RECEIVE"}>
            <CurrencyAccountValue
              account={account}
              value={amount}
              erc20Format={account.account_type === "ERC20"}
              type={operation.type}
              alwaysShowSign
            />
          </Text>
        </MUITableCell>
      </MUITableRow>
    );
  }
}

export default OperationsTable;
