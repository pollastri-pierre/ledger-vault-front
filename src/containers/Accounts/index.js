// @flow
import React, { PureComponent } from "react";
import type { MemoryHistory } from "history";
import type { Location } from "react-router-dom";

import { withMe } from "components/UserContextProvider";
import SearchAccountsQuery from "api/queries/SearchAccounts";
import { AccountsFilters } from "components/filters";
import { AccountsTable } from "components/Table";
import DataSearch from "components/DataSearch";
import AddLink from "components/base/AddLink";
import Box from "components/base/Box";
import Text from "components/base/Text";
import { CardTitle } from "components/base/Card";
import type { Account, User } from "data/types";

import ApproveRequestMutation from "api/mutations/ApproveRequestMutation";
import AbortRequestMutation from "api/mutations/AbortRequestMutation";

type Props = {
  history: MemoryHistory,
  location: Location,
  me: User,
};

const mutationsToListen = [ApproveRequestMutation, AbortRequestMutation];

class AdminAccounts extends PureComponent<Props> {
  handleAccountClick = (account: Account) => {
    const orgaName = this.props.location.pathname.split("/")[1];
    this.props.history.push(`/${orgaName}/admin/account/${account.id}`);
  };

  createAccount = () => {
    const { history } = this.props;
    history.push(`accounts/new`);
  };

  HeaderComponent = () => {
    const { me } = this.props;
    return (
      <Box horizontal align="flex-start" justify="space-between" pb={20}>
        <CardTitle i18nKey="menu:admin.accounts" />
        {me.role === "ADMIN" && (
          <AddLink onClick={this.createAccount}>
            <Text i18nKey="accountCreation:cta" />
          </AddLink>
        )}
      </Box>
    );
  };

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
        listenMutations={mutationsToListen}
      />
    );
  }
}

export default withMe(AdminAccounts);
