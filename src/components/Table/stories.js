/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";
import styled from "styled-components";

import { genAccounts, genOperations } from "data/mock-entities";
import { AccountsTable, OperationsTable } from "components/Table";
import Card from "components/base/Card";

const accounts = genAccounts(10);
const operations = genOperations(25, accounts);

storiesOf("Components/tables", module)
  .add("AccountsTable", () => (
    <Wrapper>
      <AccountsTable accounts={accounts} />
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
