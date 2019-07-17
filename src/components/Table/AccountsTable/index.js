// @flow

import React, { PureComponent } from "react";
import MUITableBody from "@material-ui/core/TableBody";
import type { ObjectParameters } from "query-string";

import { withMe } from "components/UserContextProvider";
import NoDataPlaceholder from "components/NoDataPlaceholder";

import type { Account, User } from "data/types";
import AccountRow from "./AccountRow";

import { Table, TableHeader } from "../TableBase";
import TableScroll from "../TableScroll";
import { accountsTableDefault, roleColumn } from "./tableDefinitions";
import type { TableDefinition } from "../types";

type Props = {
  data: Account[],
  me: User,
  customTableDef?: TableDefinition,
  onSortChange?: (string, ?string) => void,
  queryParams?: ObjectParameters,
  onRowClick: Account => void,
};

type State = {
  tableDefinition: TableDefinition,
};

class AccountsTable extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    const isOperator = props.me.role === "OPERATOR";

    this.state = {
      tableDefinition:
        props.customTableDef || isOperator
          ? [...accountsTableDefault, roleColumn]
          : accountsTableDefault,
    };
  }

  Account = (account: Account) => {
    const { onRowClick } = this.props;
    const { tableDefinition } = this.state;
    return (
      <AccountRow
        key={account.id}
        account={account}
        onClick={onRowClick}
        tableDefinition={tableDefinition}
      />
    );
  };

  render() {
    const { data, onSortChange, queryParams } = this.props;
    const { tableDefinition } = this.state;
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
          <MUITableBody>{data.map(this.Account)}</MUITableBody>
        </Table>
      </TableScroll>
    );
  }
}

export default withMe(AccountsTable);
