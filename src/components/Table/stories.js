/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";
import styled from "styled-components";

import {
  genMembers,
  genAccounts,
  genOperations,
  genGroups
} from "data/mock-entities";

import { GroupsTable, AccountsTable, OperationsTable } from "components/Table";
import { action } from "@storybook/addon-actions";
import Card from "components/base/Card";

const members = genMembers(20);
const accounts = genAccounts(10, { members });
const operations = genOperations(25, { accounts, members });
const groups = genGroups(10, { members });

storiesOf("tables", module)
  .add("AccountsTable", () => (
    <Wrapper>
      <AccountsTable accounts={accounts} />
    </Wrapper>
  ))
  .add("GroupsTable", () => (
    <Wrapper>
      <GroupsTable data={groups} onRowClick={action("onRowClick")} />
    </Wrapper>
  ))
  .add("OperationsTable", () => (
    <Wrapper>
      <OperationsTable accounts={accounts} data={operations} />
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
