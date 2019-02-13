/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";
import styled from "styled-components";

import { genAccounts, genOperations, genGroups } from "data/mock-entities";
import { GroupsTable, AccountsTable, OperationsTable } from "components/Table";
import { action } from "@storybook/addon-actions";
import Card from "components/base/Card";

const accounts = genAccounts(10);
const operations = genOperations(25, accounts);
const groups = genGroups(10);

storiesOf("Components/tables", module)
  .add("AccountsTable", () => (
    <Wrapper>
      <AccountsTable accounts={accounts} />
    </Wrapper>
  ))
  .add("GroupsTable", () => (
    <Wrapper>
      <GroupsTable groups={groups} onGroupClick={action("onClickGroup")} />
    </Wrapper>
  ))
  .add("OperationsTable", () => (
    <Wrapper>
      <OperationsTable accounts={accounts} operations={operations} />
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
