// @flow

import React, { PureComponent } from "react";
import MUITable from "@material-ui/core/Table";
import MUITableBody from "@material-ui/core/TableBody";

import NoDataPlaceholder from "components/NoDataPlaceholder";

import type { Account } from "data/types";
import AccountRow from "./AccountRow";

import { TableHeader } from "../TableBase";
import TableScroll from "../TableScroll";
import { accountsTableDefault } from "./tableDefinitions";
import type { TableDefault } from "../types";

type Props = {
  accounts: Account[],
  customTableDef?: TableDefault,
  onAccountClick: Account => void
};
type State = {
  tableDefinition: TableDefault
};

class AccountsTable extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      tableDefinition: props.customTableDef || accountsTableDefault
    };
  }

  Account = (account: Account) => {
    const { onAccountClick } = this.props;
    const { tableDefinition } = this.state;
    return (
      <AccountRow
        key={account.id}
        account={account}
        onClick={onAccountClick}
        tableDefinition={tableDefinition}
      />
    );
  };

  render() {
    const { accounts } = this.props;
    const { tableDefinition } = this.state;
    if (!accounts.length) {
      return <NoDataPlaceholder title="No accounts" />;
    }

    return (
      <TableScroll>
        <MUITable>
          <TableHeader tableDefinition={tableDefinition} type="accounts" />
          <MUITableBody>{accounts.map(this.Account)}</MUITableBody>
        </MUITable>
      </TableScroll>
    );
  }
}

export default AccountsTable;
