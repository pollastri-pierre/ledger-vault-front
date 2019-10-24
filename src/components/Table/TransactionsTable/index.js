// @flow

import React, { useState } from "react";
import type { ObjectParameters } from "query-string";
import MUITableBody from "@material-ui/core/TableBody";

import NoDataPlaceholder from "components/NoDataPlaceholder";

import type { Account, Transaction } from "data/types";

import TransactionRow from "./TransactionRow";
import { defaultDefinition } from "./tableDefinitions";
import TableScroll from "../TableScroll";
import type { TableDefinition } from "../types";
import { Table, TableHeader } from "../TableBase";

type Props = {
  data: Transaction[],
  onRowClick: Transaction => void,
  accounts: Account[],
  customTableDef?: TableDefinition,
  onSortChange?: (string, ?string) => void,
  queryParams?: ObjectParameters,
};

function TransactionsTable(props: Props) {
  const { data, onSortChange, queryParams, accounts, onRowClick } = props;
  const [tableDefinition] = useState(props.customTableDef || defaultDefinition);

  const Tx = (transaction: Transaction) => {
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
        <MUITableBody>{data.map(Tx)}</MUITableBody>
      </Table>
    </TableScroll>
  );
}

export default TransactionsTable;
