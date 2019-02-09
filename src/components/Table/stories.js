/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";

import { genAccounts, genOperations } from "data/mock-entities";
import { AccountsTable, OperationsTable } from "components/Table";

const accounts = genAccounts(10);
const operations = genOperations(25, accounts);

storiesOf("Components/tables", module)
  .add("AccountsTable", () => <AccountsTable accounts={accounts} />)
  .add("OperationsTable", () => (
    <OperationsTable accounts={accounts} operations={operations} />
  ));
