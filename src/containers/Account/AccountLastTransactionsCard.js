// @flow

import React, { Component } from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-dom";

import type { Match, Location } from "react-router-dom";
import type { MemoryHistory } from "history";

import { withMe } from "components/UserContextProvider";
import { Label } from "components/base/form";
import Box from "components/base/Box";
import { TransactionsTable } from "components/Table";
import Card, { CardLoading, CardError } from "components/base/Card";
import { defaultDefinition as defaultTableDefinition } from "components/Table/TransactionsTable";

import connectData from "restlay/connectData";
import SearchTransactions from "api/queries/SearchTransactions";

import type { Connection } from "restlay/ConnectionQuery";
import type { Account, Transaction, User } from "data/types";

type Props = {
  account: Account,
  transactions: Connection<Transaction>,
  match: Match,
  history: MemoryHistory,
  location: Location,
  me: User,
};

const tableDefinition = defaultTableDefinition.filter(
  col => col.body.prop !== "name",
);

class AccountLastTransactionsCard extends Component<Props> {
  handleTransactionClick = (transaction: Transaction) => {
    const { history, match } = this.props;
    history.push(
      `${match.url}/transactions/details/${transaction.id}/overview`,
    );
  };

  render() {
    const { account, transactions, me } = this.props;

    const orgaName = this.props.location.pathname.split("/")[1];
    const role = me.role === "ADMIN" ? "admin" : "operator";
    const seeAllURL = `/${orgaName}/${role}/transactions?account=${account.id}`;

    const inner = transactions.edges.length ? (
      <>
        <Box horizontal justify="space-between">
          <Label>Last transactions</Label>
          <Link to={seeAllURL}>See all</Link>
        </Box>
        <TransactionsTable
          customTableDef={tableDefinition}
          accounts={[account]}
          data={transactions.edges.map(e => e.node)}
          onRowClick={this.handleTransactionClick}
        />
      </>
    ) : (
      "No transactions for this account"
    );

    return <Card>{inner}</Card>;
  }
}

export default connectData(withRouter(withMe(AccountLastTransactionsCard)), {
  queries: {
    transactions: SearchTransactions,
  },
  propsToQueryParams: ({ account }: { account: Account }) => ({
    account: [account.id],
  }),
  RenderError: CardError,
  RenderLoading: CardLoading,
});
