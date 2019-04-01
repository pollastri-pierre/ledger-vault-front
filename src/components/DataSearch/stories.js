/* eslint-disable react/prop-types */

import React, { Component } from "react";
import qs from "query-string";
import styled from "styled-components";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import {
  genAccounts,
  genGroups,
  genUsers,
  genTransactions,
} from "data/mock-entities";

import { delay } from "utils/promise";

import RestlayProvider from "restlay/RestlayProvider";

import SearchTransactionsQuery from "api/queries/SearchTransactions";
import SearchGroupsQuery from "api/queries/SearchGroups";
import SearchAccountsQuery from "api/queries/SearchAccounts";

import {
  TransactionsTable,
  GroupsTable,
  AccountsTable,
} from "components/Table";

import {
  TransactionsFilters,
  GroupsFilters,
  AccountsFilters,
} from "components/filters";

import DataSearch from "components/DataSearch";
import DisplayQueryParams from "stories/components/DisplayQueryParams";

// --------------------------------- actual components

const TransactionsSearch = ({ ...props }) => (
  <DataSearch
    Query={SearchTransactionsQuery}
    TableComponent={TransactionsTable}
    FilterComponent={TransactionsFilters}
    extraProps={{ accounts }}
    {...props}
  />
);

const GroupsSearch = props => (
  <DataSearch
    Query={SearchGroupsQuery}
    TableComponent={GroupsTable}
    FilterComponent={GroupsFilters}
    {...props}
  />
);

const AccountsSearch = props => (
  <DataSearch
    Query={SearchAccountsQuery}
    TableComponent={AccountsTable}
    FilterComponent={AccountsFilters}
    pageSize={8}
    {...props}
  />
);

// --------------------------------- mock data

const users = genUsers(20);
const accounts = genAccounts(10, { users });
const transactions = genTransactions(25, { accounts, users });
const groups = genGroups(4, { users });

const TransactionsSearchStory = wrapComponent(
  TransactionsSearch,
  "transactions",
);
const GroupsSearchStory = wrapComponent(GroupsSearch, "groups");
const AccountsSearchStory = wrapComponent(AccountsSearch, "accounts");

storiesOf("search", module)
  .add("Search transactions", () => <TransactionsSearchStory />)
  .add("Search groups", () => <GroupsSearchStory />)
  .add("Search accounts", () => <AccountsSearchStory />);

// --------------------------------- story helpers

const mockNetwork = async url => {
  const queryParams = qs.parse(url.substr(url.indexOf("?")));
  let edges;
  if (url.startsWith("/transactions?")) {
    edges = transactions.filter(transaction => {
      if (
        queryParams.currency &&
        queryParams.currency !== transaction.currency_name
      )
        return false;
      if (
        queryParams.accounts &&
        queryParams.accounts.indexOf(transaction.account_id.toString()) === -1
      )
        return false;
      return true;
    });
  }
  if (url.startsWith("/groups")) {
    edges = groups.filter(g => {
      if (
        queryParams.name &&
        g.name.toLowerCase().indexOf(queryParams.name.toLowerCase()) === -1
      )
        return false;
      return true;
    });
  }
  if (url.startsWith("/accounts-mock?")) {
    const filteredAccounts = accounts.filter(a => {
      if (
        queryParams.name &&
        a.name.toLowerCase().indexOf(queryParams.name.toLowerCase()) === -1
      )
        return false;
      return true;
    });

    const page = (queryParams.page && parseInt(queryParams.page, 10) - 1) || 0;
    const start = page * queryParams.pageSize;
    const end = start + parseInt(queryParams.pageSize, 10);
    edges = filteredAccounts.slice(start, end);

    return {
      edges: edges.map(transaction => ({
        node: transaction,
        cursor: transaction.id,
      })),
      pageInfo: { hasNextPage: false, count: filteredAccounts.length },
    };
  }

  if (!edges) {
    throw new Error("cant find route");
  }

  await delay(1e3);
  return {
    edges: edges.map(transaction => ({
      node: transaction,
      cursor: transaction.id,
    })),
    pageInfo: { hasNextPage: false },
  };
};

const styles = {
  displayQueryParams: {
    marginBottom: 20,
  },
};

function wrapComponent(ComponentToDecorate, prefix) {
  class Wrapper extends Component<*, *> {
    state = {
      queryParams: {},
    };

    handleChangeQueryParams = queryParams => this.setState({ queryParams });

    render() {
      const { queryParams } = this.state;
      return (
        <RestlayProvider network={mockNetwork}>
          <Container>
            <DisplayQueryParams
              prefix={prefix}
              queryParams={queryParams}
              style={styles.displayQueryParams}
            />
            <ComponentToDecorate
              onQueryParamsChange={this.handleChangeQueryParams}
              onRowClick={action("onRowClick")}
            />
          </Container>
        </RestlayProvider>
      );
    }
  }

  return Wrapper;
}

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #f9f9f9;
  padding: 20px;
  overflow: auto;
`;
