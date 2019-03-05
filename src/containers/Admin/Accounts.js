// @flow
import React, { PureComponent } from "react";
import type { MemoryHistory } from "history";
import type { Location } from "react-router-dom";

import { accountsTableCustom1 } from "components/Table/AccountsTable/tableDefinitions";
import SearchAccountsQuery from "api/queries/SearchAccounts";
import { AccountsFilters } from "components/filters";
import { AccountsTable } from "components/Table";
import DataSearch from "components/DataSearch";
import type { Account } from "data/types";

type Props = {
  history: MemoryHistory,
  location: Location
};

class AdminAccounts extends PureComponent<Props> {
  handleAccountClick = (account: Account) => {
    const orgaName = this.props.location.pathname.split("/")[1];
    this.props.history.push(`/${orgaName}/admin/account/${account.id}`);
  };

  render() {
    return (
      <DataSearch
        Query={SearchAccountsQuery}
        TableComponent={AccountsTable}
        FilterComponent={AccountsFilters}
        customTableDefinition={accountsTableCustom1}
        onRowClick={this.handleAccountClick}
      />
    );
  }
}

export default AdminAccounts;
