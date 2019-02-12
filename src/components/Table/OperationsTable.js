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
import OperationStatus from "components/OperationStatus";

import type { Account, Operation } from "data/types";

import TableScroll from "./TableScroll";

type Props = {
  operations: Operation[],
  onOperationClick: Operation => void,
  accounts: Account[],

  // additional fields
  withStatus?: boolean,
  withLabel?: boolean
};

class OperationsTable extends PureComponent<Props> {
  Operation = (operation: Operation) => {
    const { accounts, onOperationClick, withStatus, withLabel } = this.props;

    const account = accounts.find(
      account => account.id === operation.account_id
    );

    if (!account) {
      return null;
    }

    const key = `${operation.account_id}-${operation.id}-${operation.type}`;

    return (
      <OperationRow
        key={key}
        operation={operation}
        account={account}
        onClick={onOperationClick}
        withStatus={withStatus}
        withLabel={withLabel}
      />
    );
  };

  render() {
    const { operations, withStatus, withLabel } = this.props;

    if (!operations.length) {
      return <NoDataPlaceholder title="No operations" />;
    }

    return (
      <TableScroll>
        <MUITable>
          <OperationsTableHeader
            withStatus={withStatus}
            withLabel={withLabel}
          />
          <MUITableBody>{operations.map(this.Operation)}</MUITableBody>
        </MUITable>
      </TableScroll>
    );
  }
}

type OperationsTableHeaderProps = {
  withStatus?: boolean,
  withLabel?: boolean
};

class OperationsTableHeader extends PureComponent<OperationsTableHeaderProps> {
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
          <MUITableCell numeric>Amount</MUITableCell>
        </MUITableRow>
      </MUITableHead>
    );
  }
}

type OperationRowProps = {
  operation: Operation,
  account: Account,
  onClick: Operation => void,

  // additional fields
  withStatus?: boolean,
  withLabel?: boolean
};

const operationRowHover = { cursor: "pointer" };

class OperationRow extends PureComponent<OperationRowProps> {
  handleClick = () => {
    this.props.onClick(this.props.operation);
  };

  render() {
    const { operation, account, onClick, withStatus, withLabel } = this.props;

    const amount =
      operation.amount || (operation.price && operation.price.amount);

    const note = operation.notes && operation.notes[0];

    return (
      <MUITableRow
        hover={!!onClick}
        style={onClick ? operationRowHover : undefined}
        onClick={onClick ? this.handleClick : undefined}
      >
        <MUITableCell>
          <DateFormat format="ddd D MMM, h:mmA" date={operation.created_on} />
        </MUITableCell>

        <MUITableCell>
          <AccountName account={account} />
        </MUITableCell>

        {withStatus && (
          <MUITableCell>
            <OperationStatus operation={operation} />
          </MUITableCell>
        )}

        {withLabel && <MUITableCell>{note || null}</MUITableCell>}

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
