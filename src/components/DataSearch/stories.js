/* eslint-disable react/prop-types */

import React, { Component } from "react";
import qs from "query-string";
import styled from "styled-components";
import { storiesOf } from "@storybook/react";
import { action } from "@storybook/addon-actions";

import {
  genAccounts,
  genGroups,
  genMembers,
  genOperations
} from "data/mock-entities";

import { delay } from "data/mock-api";

import RestlayProvider from "restlay/RestlayProvider";

import SearchOperationsQuery from "api/queries/SearchOperations";
import SearchGroupsQuery from "api/queries/SearchGroups";
import SearchAccountsQuery from "api/queries/SearchAccounts";

import { OperationsTable, GroupsTable, AccountsTable } from "components/Table";

import {
  OperationsFilters,
  GroupsFilters,
  AccountsFilters
} from "components/filters";

import DataSearch from "components/DataSearch";
import DisplayQueryParams from "stories/components/DisplayQueryParams";

// --------------------------------- actual components

const OperationsSearch = ({ ...props }) => (
  <DataSearch
    Query={SearchOperationsQuery}
    TableComponent={OperationsTable}
    FilterComponent={OperationsFilters}
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
    {...props}
  />
);

// --------------------------------- mock data

const members = genMembers(20);
const accounts = genAccounts(10, { members });
const operations = genOperations(25, { accounts, members });
const groups = genGroups(4, { members });

const OperationsSearchStory = wrapComponent(OperationsSearch, "operations");
const GroupsSearchStory = wrapComponent(GroupsSearch, "groups");
const AccountsSearchStory = wrapComponent(AccountsSearch, "accounts");

storiesOf("search", module)
  .add("Search operations", () => <OperationsSearchStory />)
  .add("Search groups", () => <GroupsSearchStory />)
  .add("Search accounts", () => <AccountsSearchStory />);

// --------------------------------- story helpers

const mockNetwork = async url => {
  const queryParams = qs.parse(url.substr(url.indexOf("?")));
  let edges;
  if (url.startsWith("/operations?")) {
    edges = operations.filter(op => {
      if (queryParams.currency && queryParams.currency !== op.currency_name)
        return false;
      if (
        queryParams.accounts &&
        queryParams.accounts.indexOf(op.account_id.toString()) === -1
      )
        return false;
      return true;
    });
  }
  if (url.startsWith("/groups-mock?")) {
    edges = groups.filter(g => {
      if (
        queryParams.name &&
        g.name.toLowerCase().indexOf(queryParams.name.toLowerCase()) === -1
      )
        return false;
      return true;
    });
  }
  if (url.startsWith("/accounts?")) {
    edges = accounts.filter(a => {
      if (
        queryParams.name &&
        a.name.toLowerCase().indexOf(queryParams.name.toLowerCase()) === -1
      )
        return false;
      return true;
    });
  }

  if (!edges) {
    throw new Error("cant find route");
  }

  await delay(1e3);
  return {
    edges: edges.map(op => ({ node: op, cursor: op.id })),
    pageInfo: { hasNextPage: false }
  };
};

const styles = {
  displayQueryParams: {
    marginBottom: 20
  }
};

function wrapComponent(ComponentToDecorate, prefix) {
  class Wrapper extends Component<*, *> {
    state = {
      queryParams: {}
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
