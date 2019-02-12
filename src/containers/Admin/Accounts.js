// @flow
import React, { PureComponent } from "react";
import { withRouter } from "react-router";
import connectData from "restlay/connectData";
import AccountsQuery from "api/queries/AccountsQuery";

import Box from "components/base/Box";
import { AccountsTable } from "components/Table";

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
      <Box mt={80}>
        <AccountsTable
          accounts={accounts}
          onAccountClick={this.handleAccountClick}
        />
      </Box>
    );
  }
}

export default withRouter(
  connectData(AdminAccounts, {
    queries: {
      accounts: AccountsQuery
    }
  })
);
