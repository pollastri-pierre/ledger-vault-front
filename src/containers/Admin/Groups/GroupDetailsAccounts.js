// @flow

import React, { PureComponent } from "react";
import { Trans } from "react-i18next";

import type { Account } from "data/types";
import connectData from "restlay/connectData";
import NoDataPlaceholder from "components/NoDataPlaceholder";
import AccountsInGroupQuery from "api/queries/AccountsInGroupQuery";
import { SpinnerCentered } from "components/base/Spinner";
import type { Connection } from "restlay/ConnectionQuery";

import AccountsList from "components/lists/AccountsList";

type Props = {
  accounts: Connection<Account>,
};

class GroupDetailsAccounts extends PureComponent<Props> {
  render() {
    const { accounts } = this.props;
    const allAccounts = accounts.edges.map(e => e.node);
    if (allAccounts.length === 0) {
      return (
        <NoDataPlaceholder title={<Trans i18nKey="group:no_accounts_yet" />} />
      );
    }
    return (
      <AccountsList
        accounts={allAccounts}
        compact
        display="grid"
        tileWidth={250}
      />
    );
  }
}

export default connectData(GroupDetailsAccounts, {
  RenderLoading: SpinnerCentered,
  queries: {
    accounts: AccountsInGroupQuery,
  },
  propsToQueryParams: props => ({
    groupId: props.group.id,
  }),
});
