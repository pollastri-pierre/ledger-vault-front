// @flow

import React, { PureComponent } from "react";
import type { ObjectParameters } from "query-string";

import MUITableBody from "@material-ui/core/TableBody";
import MUITableCell from "@material-ui/core/TableCell";
import MUITableRow from "@material-ui/core/TableRow";

import Text from "components/base/Text";
import CounterValue from "components/CounterValue";
import DateFormat from "components/DateFormat";
import AccountName from "components/AccountName";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import NoDataPlaceholder from "components/NoDataPlaceholder";
import TransactionStatus from "components/TransactionStatus";
import TransactionTypeIcon from "components/TransactionTypeIcon";

import type { Account, Transaction } from "data/types";

import TableScroll from "./TableScroll";
import type { TableDefinition } from "./types";
import { Table, TableHeader } from "./TableBase";

type Props = {
  data: Transaction[],
  onRowClick: Transaction => void,
  accounts: Account[],
  customTableDef?: TableDefinition,
  onSortChange?: (string, ?string) => void,
  queryParams?: ObjectParameters,
};

type State = {
  tableDefinition: TableDefinition,
};

export const defaultDefinition = [
  {
    header: {
      label: "",
      align: "left",
    },
    body: {
      prop: "type",
      align: "left",
    },
  },
  {
    header: {
      label: "Date",
      align: "left",
      sortable: true,
    },
    body: {
      prop: "created_on",
      align: "left",
    },
  },
  {
    header: {
      label: "Name",
      align: "left",
    },
    body: {
      prop: "name",
      align: "left",
    },
  },
  {
    header: {
      label: "Status",
      align: "left",
    },
    body: {
      prop: "status",
      align: "left",
    },
  },
  {
    header: {
      label: "Countervalue",
      align: "right",
    },
    body: {
      prop: "countervalue",
      align: "right",
    },
  },
  {
    header: {
      label: "Amount",
      align: "right",
      sortable: true,
      sortFirst: "desc",
    },
    body: {
      prop: "amount",
      align: "right",
    },
  },
];

class TransactionsTable extends PureComponent<Props, State> {
  state = {
    tableDefinition: this.props.customTableDef || defaultDefinition,
  };

  Transaction = (transaction: Transaction) => {
    const { accounts, onRowClick } = this.props;
    const { tableDefinition } = this.state;

    const account = accounts.find(
      account => account.id === transaction.account_id,
    );

    if (!account) {
      return null;
    }

    const key = `${transaction.account_id}-${transaction.id}-${transaction.type}`;

    return (
      <TransactionRow
        key={key}
        tableDefinition={tableDefinition}
        transaction={transaction}
        account={account}
        onClick={onRowClick}
      />
    );
  };

  render() {
    const { data, onSortChange, queryParams } = this.props;
    const { tableDefinition } = this.state;

    if (!data.length) {
      return <NoDataPlaceholder title="No transactions found." />;
    }

    return (
      <TableScroll>
        <Table>
          <TableHeader
            tableDefinition={tableDefinition}
            onSortChange={onSortChange}
            queryParams={queryParams}
          />
          <MUITableBody>{data.map(this.Transaction)}</MUITableBody>
        </Table>
      </TableScroll>
    );
  }
}

type TransactionRowProps = {
  transaction: Transaction,
  account: Account,
  onClick: Transaction => void,
  tableDefinition: TableDefinition,

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
    const {
      transaction,
      account,
      onClick,
      withStatus = true,
      withLabel,
      tableDefinition,
    } = this.props;

    const amount =
      transaction.amount || (transaction.price && transaction.price.amount);

    const note = transaction.notes && transaction.notes[0];

    // FIXME it should be handled like other tables, mapping into table
    // definition, etc. For now, quick win.
    const hasName = tableDefinition.find(col => col.body.prop === "name");

    return (
      <MUITableRow
        hover={!!onClick}
        style={onClick ? transactionRowHover : undefined}
        onClick={onClick ? this.handleClick : undefined}
      >
        <MUITableCell align="center" size="small" padding="checkbox">
          <TransactionTypeIcon type={transaction.type} />
        </MUITableCell>

        <MUITableCell>
          <DateFormat format="ddd D MMM, h:mmA" date={transaction.created_on} />
        </MUITableCell>

        {hasName && (
          <MUITableCell>
            <AccountName account={account} />
          </MUITableCell>
        )}

        {withStatus && (
          <MUITableCell>
            <TransactionStatus transaction={transaction} />
          </MUITableCell>
        )}

        {withLabel && <MUITableCell>{note ? note.content : ""}</MUITableCell>}

        <MUITableCell align="right">
          <CounterValue
            fromAccount={account}
            value={amount}
            alwaysShowSign
            type={transaction.type}
          />
        </MUITableCell>

        <MUITableCell align="right">
          <Text bold={transaction.type === "RECEIVE"}>
            <CurrencyAccountValue
              account={account}
              value={amount}
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
