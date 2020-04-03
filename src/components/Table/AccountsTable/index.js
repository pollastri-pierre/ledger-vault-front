// @flow

import React, { useState } from "react";
import type { ObjectParameters } from "query-string";

import { withMe } from "components/UserContextProvider";
import NoDataPlaceholder from "components/NoDataPlaceholder";

import type { Account, User } from "data/types";
import AccountRow from "./AccountRow";

import { Table, TableHeader } from "../TableBase";
import TableScroll from "../TableScroll";
import {
  accountsTableDefault,
  accountsIsOperatorTableDefault,
} from "./tableDefinitions";
import type { TableDefinition } from "../types";

type Props = {
  data: Account[],
  me: User,
  customTableDef?: TableDefinition,
  onSortChange?: (string, ?string) => void,
  queryParams?: ObjectParameters,
  onRowClick: Account => void,
};

function AccountsTable(props: Props) {
  const { data, onSortChange, queryParams, onRowClick } = props;
  const isOperator = props.me.role === "OPERATOR";
  const [tableDefinition] = useState(
    props.customTableDef || isOperator
      ? accountsIsOperatorTableDefault
      : accountsTableDefault,
  );

  const Accnt = (account: Account) => {
    return (
      <AccountRow
        key={account.id}
        account={account}
        onClick={onRowClick}
        tableDefinition={tableDefinition}
      />
    );
  };

  if (!data.length) {
    return <NoDataPlaceholder title="No accounts found." />;
  }

  return (
    <TableScroll>
      <Table>
        <TableHeader
          tableDefinition={tableDefinition}
          type="accounts"
          onSortChange={onSortChange}
          queryParams={queryParams}
        />
        <tbody>{data.map(Accnt)}</tbody>
      </Table>
    </TableScroll>
  );
}

export default withMe(AccountsTable);
