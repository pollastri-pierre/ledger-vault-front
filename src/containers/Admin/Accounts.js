// @flow
import React, { PureComponent } from "react";
import type { MemoryHistory } from "history";
import type { Location } from "react-router-dom";

import SearchAccountsQuery from "api/queries/SearchAccounts";
import { AccountsFilters } from "components/filters";
import { AccountsTable } from "components/Table";
import DataSearch from "components/DataSearch";
import AddLink from "components/base/AddLink";
import Box from "components/base/Box";
import Text from "components/base/Text";
import { CardTitle } from "components/base/Card";
import type { Account } from "data/types";

type Props = {
  history: MemoryHistory,
  location: Location,
};

class AdminAccounts extends PureComponent<Props> {
  handleAccountClick = (account: Account) => {
    const orgaName = this.props.location.pathname.split("/")[1];
    this.props.history.push(`/${orgaName}/admin/account/${account.id}`);
  };

  createAccount = () => {
    const { history } = this.props;
    history.push(`accounts/new`);
  };

  HeaderComponent = () => (
    <Box horizontal align="flex-start" justify="space-between" pb={20}>
      <CardTitle i18nKey="menu:admin.accounts" />
      <AddLink onClick={this.createAccount}>
        <Text i18nKey="accountCreation:cta" />
      </AddLink>
    </Box>
  );

  render() {
    const { history } = this.props;
    return (
      <DataSearch
        Query={SearchAccountsQuery}
        TableComponent={AccountsTable}
        FilterComponent={AccountsFilters}
        onRowClick={this.handleAccountClick}
        HeaderComponent={this.HeaderComponent}
        history={history}
      />
    );
  }
}

export default AdminAccounts;
