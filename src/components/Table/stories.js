/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";

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

import requests from "data/mock-requests.json";

const users = genUsers(20);
const accounts = genAccounts(10, { users });
const transactions = genTransactions(25, { accounts, users });
const groups = genGroups(4, { users });

storiesOf("entities/Account", module).add("Accounts table", () => (
  <AccountsTable data={accounts} />
));

storiesOf("entities/Group", module).add("Groups table", () => (
  <GroupsTable data={groups} onRowClick={action("onRowClick")} />
));

storiesOf("entities/Transaction", module).add("Transactions table", () => (
  <TransactionsTable accounts={accounts} data={transactions} />
));

storiesOf("entities/Request", module).add("Requests table", () => (
  <RequestsTable data={requests} />
));
