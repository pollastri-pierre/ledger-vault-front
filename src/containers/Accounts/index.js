// @flow
import React, { PureComponent } from "react";
import type { MemoryHistory } from "history";
import type { Location } from "react-router-dom";

import { withMe } from "components/UserContextProvider";
import SearchAccountsQuery from "api/queries/SearchAccounts";
import { AccountsFilters } from "components/filters";
import { AccountsTable } from "components/Table";
import DataSearch from "components/DataSearch";
import PageHeaderActions from "components/base/PageHeaderActions";
import Text from "components/base/Text";
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
    const { me, location } = this.props;
    const role = me.role === "ADMIN" ? "admin" : "operator";
    const orgaName = location.pathname.split("/")[1];

    if (
      account.status === "MIGRATED" ||
      account.status === "HSM_COIN_UPDATED"
    ) {
      this.props.history.push(
        `${location.pathname}/accounts/edit/${account.id}`,
      );
    } else {
      this.props.history.push(
        `/${orgaName}/${role}/accounts/view/${account.id}`,
      );
    }
  };

  createAccount = () => {
    const { history } = this.props;
    history.push(`accounts/new`);
  };

  render() {
    const { history } = this.props;
    return (
      <>
        <PageHeaderActions
          onClick={this.createAccount}
          title={<Text i18nKey="menu:admin.accounts" />}
          label={<Text i18nKey="accountCreation:cta" />}
        />
        <DataSearch
          Query={SearchAccountsQuery}
          TableComponent={AccountsTable}
          FilterComponent={AccountsFilters}
          onRowClick={this.handleAccountClick}
          history={history}
          listenMutations={mutationsToListen}
        />
      </>
    );
  }
}

export default withMe(AdminAccounts);
