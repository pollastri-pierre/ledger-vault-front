/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";
import styled from "styled-components";

import {
  genUsers,
  genAccounts,
  genTransactions,
  genGroups,
} from "data/mock-entities";

import {
  GroupsTable,
  AccountsTable,
  TransactionsTable,
  RequestsTable,
} from "components/Table";
import { action } from "@storybook/addon-actions";
import Card from "components/base/Card";

import requests from "data/mock-requests.json";

const users = genUsers(20);
const accounts = genAccounts(10, { users });
const transactions = genTransactions(25, { accounts, users });
const groups = genGroups(4, { users });

storiesOf("tables", module)
  .add("AccountsTable", () => (
    <Wrapper>
      <AccountsTable data={accounts} />
    </Wrapper>
  ))
  .add("GroupsTable", () => (
    <Wrapper>
      <GroupsTable data={groups} onRowClick={action("onRowClick")} />
    </Wrapper>
  ))
  .add("TransactionsTable", () => (
    <Wrapper>
      <TransactionsTable accounts={accounts} data={transactions} />
    </Wrapper>
  ))
  .add("RequestsTable", () => (
    <Wrapper>
      <RequestsTable data={requests} />
    </Wrapper>
  ));

const Page = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #efefef;
  padding: 30px;
  overflow-y: auto;
`;

const Wrapper = ({ children }) => (
  <Page>
    <Card>{children}</Card>
  </Page>
);
