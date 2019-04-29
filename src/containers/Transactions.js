// @flow

import React, { PureComponent } from "react";
import type { MemoryHistory } from "history";
import type { Match } from "react-router-dom";

import connectData from "restlay/connectData";
import AccountsQuery from "api/queries/AccountsQuery";
import SearchTransactionsQuery from "api/queries/SearchTransactions";

import { TransactionsTable } from "components/Table";
import { TransactionsFilters } from "components/filters";
import { CardLoading, CardError } from "components/base/Card";

import DataSearch from "components/DataSearch";

import type { Account, Transaction } from "data/types";
import type { Connection } from "restlay/ConnectionQuery";

type Props = {
  history: MemoryHistory,
  match: Match,
  accounts: Connection<Account>,
};

class TransactionsContainer extends PureComponent<Props> {
  handleTransactionClick = (transaction: Transaction) => {
    const { history, match } = this.props;
    history.push(`${match.url}/transactions/details/${transaction.id}/0`);
  };

  render() {
    const { accounts, history } = this.props;
    return (
      <DataSearch
        Query={SearchTransactionsQuery}
        TableComponent={TransactionsTable}
        FilterComponent={TransactionsFilters}
        extraProps={{ accounts: accounts.edges.map(e => e.node) }}
        history={history}
        onRowClick={this.handleTransactionClick}
      />
    );
  }
}

export default connectData(TransactionsContainer, {
  queries: {
    accounts: AccountsQuery,
  },
  RenderLoading: CardLoading,
  RenderError: CardError,
});
