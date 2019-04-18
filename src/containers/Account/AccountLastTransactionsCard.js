// @flow

import React, { Component } from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";

import type { Match, Location } from "react-router-dom";
import type { MemoryHistory } from "history";

import { Label } from "components/base/form";
import Box from "components/base/Box";
import { TransactionsTable } from "components/Table";
import Card, { CardLoading, CardError } from "components/base/Card";

import connectData from "restlay/connectData";
import AccountTransactionsQuery from "api/queries/AccountTransactionsQuery";

import type { Connection } from "restlay/ConnectionQuery";
import type { Account, Transaction } from "data/types";

type Props = {
  account: Account,
  transactions: Connection<Transaction>,
  match: Match,
  history: MemoryHistory,
  location: Location,
};

class AccountLastTransactionsCard extends Component<Props> {
  handleTransactionClick = (transaction: Transaction) => {
    const { history, match } = this.props;
    history.push(`${match.url}/transactions/details/${transaction.id}/0`);
  };

  render() {
    const { account, transactions } = this.props;

    const orgaName = this.props.location.pathname.split("/")[1];
    const seeAllURL = `/${orgaName}/operator/transactions?accounts=${
      account.id
    }`;

    return (
      <Card>
        <Box horizontal justify="space-between">
          <Label>Last transactions</Label>
          <Link to={seeAllURL}>See all</Link>
        </Box>
        <TransactionsTable
          accounts={[account]}
          data={transactions.edges.map(e => e.node)}
          onRowClick={this.handleTransactionClick}
        />
      </Card>
    );
  }
}

export default connectData(withRouter(AccountLastTransactionsCard), {
  queries: {
    transactions: AccountTransactionsQuery,
  },
  initialVariables: {
    transactions: 20,
  },
  propsToQueryParams: ({ account }: { account: Account }) => ({
    accountId: String(account.id),
  }),
  RenderError: CardError,
  RenderLoading: CardLoading,
});
