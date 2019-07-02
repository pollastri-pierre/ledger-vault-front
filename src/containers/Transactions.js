// @flow

import React, { PureComponent } from "react";
import type { MemoryHistory } from "history";

import connectData from "restlay/connectData";
import AccountsQuery from "api/queries/AccountsQuery";
import SearchTransactionsQuery from "api/queries/SearchTransactions";

import { TransactionsTable } from "components/Table";
import { TransactionsFilters } from "components/filters";
import { CardError } from "components/base/Card";
import { WidgetLoading } from "components/widgets/Widget";

import DataSearch from "components/DataSearch";

import type { Account, Transaction } from "data/types";
import type { Connection } from "restlay/ConnectionQuery";

type Props = {
  history: MemoryHistory,
  accounts: Connection<Account>,
};

class TransactionsContainer extends PureComponent<Props> {
  handleTransactionClick = (transaction: Transaction) => {
    const { history } = this.props;
    history.push(`transactions/details/${transaction.id}/overview`);
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
  RenderLoading: () => <WidgetLoading height={300} />,
  RenderError: CardError,
});
