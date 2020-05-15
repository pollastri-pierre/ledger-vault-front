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
import colors from "shared/colors";

import RestlayProvider from "restlay/RestlayProvider";
import UserContextProvider from "components/UserContextProvider";

import SearchTransactionsQuery from "api/queries/SearchTransactions";
import SearchGroupsQuery from "api/queries/SearchGroups";
import SearchAccountsQuery from "api/queries/SearchAccounts";
import SearchRequestsQuery from "api/queries/RequestsQuery";
import SearchUsersQuery from "api/queries/SearchUsers";

import {
  TransactionsTable,
  GroupsTable,
  AccountsTable,
  UsersTable,
  RequestsTable,
} from "components/Table";

import {
  TransactionsFilters,
  GroupsFilters,
  AccountsFilters,
  UsersFilters,
  RequestsFilters,
} from "components/filters";

import DataSearch from "components/DataSearch";
import DisplayQueryParams from "stories/components/DisplayQueryParams";

import mockRequests from "data/mock-requests.json";

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

const GroupsSearch = (props) => (
  <DataSearch
    Query={SearchGroupsQuery}
    TableComponent={GroupsTable}
    FilterComponent={GroupsFilters}
    {...props}
  />
);

export const AccountsSearch = (props) => (
  <DataSearch
    Query={SearchAccountsQuery}
    TableComponent={AccountsTable}
    FilterComponent={AccountsFilters}
    {...props}
  />
);

export const UsersSearch = (props) => (
  <DataSearch
    Query={SearchUsersQuery}
    TableComponent={UsersTable}
    FilterComponent={UsersFilters}
    {...props}
  />
);

export const RequestsSearch = (props) => (
  <DataSearch
    Query={SearchRequestsQuery}
    TableComponent={RequestsTable}
    FilterComponent={RequestsFilters}
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
const UsersSearchStory = wrapComponent(UsersSearch, "accounts");
const RequestsSearchStory = wrapComponent(RequestsSearch, "requests");

storiesOf("entities/Transaction", module).add("Transactions search", () => (
  <TransactionsSearchStory />
));

storiesOf("entities/Group", module).add("Groups search", () => (
  <GroupsSearchStory />
));

storiesOf("entities/Account", module).add("Accounts search", () => (
  <AccountsSearchStory />
));

storiesOf("entities/User", module).add("Users search", () => (
  <UsersSearchStory />
));

storiesOf("entities/Request", module).add("Requests search", () => (
  <RequestsSearchStory />
));

// --------------------------------- story helpers

export const mockNetwork = async (url) => {
  const queryParams = qs.parse(url.substr(url.indexOf("?")));
  let edges;
  if (url.startsWith("/transactions?")) {
    edges = transactions.filter((transaction) => {
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
    edges = groups.filter((g) => {
      if (
        queryParams.name &&
        g.name.toLowerCase().indexOf(queryParams.name.toLowerCase()) === -1
      )
        return false;
      return true;
    });
  }
  if (url.startsWith("/accounts")) {
    const filteredAccounts = accounts.filter((a) => {
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
      edges: edges.map((transaction) => ({
        node: transaction,
        cursor: transaction.id,
      })),
      pageInfo: { hasNextPage: false, count: filteredAccounts.length },
    };
  }

  if (url.startsWith("/people")) {
    edges = users;
  }

  if (url.startsWith("/requests")) {
    edges = mockRequests;
  }

  if (!edges) {
    throw new Error(`cant find route ${url}`);
  }

  await delay(500);
  return {
    edges: edges.map((transaction) => ({
      node: transaction,
      cursor: transaction.id,
    })),
    pageInfo: { hasNextPage: false, count: edges.length },
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

    handleChangeQueryParams = (queryParams) => this.setState({ queryParams });

    render() {
      const { queryParams } = this.state;
      return (
        <UserContextProvider me={users[0]}>
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
        </UserContextProvider>
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
  background-color: ${colors.cream};
  padding: 20px;
  overflow: auto;
`;
