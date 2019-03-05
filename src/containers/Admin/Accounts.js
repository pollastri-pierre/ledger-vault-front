// @flow
import React, { PureComponent } from "react";
import { withRouter } from "react-router";
import connectData from "restlay/connectData";
import AccountsQuery from "api/queries/AccountsQuery";

import Card, { CardLoading, CardError } from "components/base/Card";
import AccountsTable from "components/Table/AccountsTable";
import Box from "components/base/Box";
import { accountsTableCustom1 } from "components/Table/AccountsTable/tableDefinitions";
import type { Account } from "data/types";
import type { MemoryHistory } from "history";
import type { Location } from "react-router-dom";

type Props = {
  accounts: Account[],
  history: MemoryHistory,
  location: Location
};

class AdminAccounts extends PureComponent<Props> {
  handleAccountClick = (account: Account) => {
    const orgaName = this.props.location.pathname.split("/")[1];
    this.props.history.push(`/${orgaName}/admin/account/${account.id}`);
  };

  render() {
    const { accounts } = this.props;

    return (
      <Card>
        <AccountsTable data={accounts} onRowClick={this.handleAccountClick} />
        <Box bg="#eee" style={{ height: 40 }} justify="center" align="center">
          Just to illustrate 2 tables
        </Box>
        <AccountsTable
          data={accounts}
          customTableDef={accountsTableCustom1}
          onRowClick={this.handleAccountClick}
        />
      </Card>
    );
  }
}

export default withRouter(
  connectData(AdminAccounts, {
    RenderLoading: CardLoading,
    RenderError: CardError,
    queries: {
      accounts: AccountsQuery
    }
  })
);
