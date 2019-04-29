/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";
import StoryRouter from "storybook-react-router";

import TransactionDetails from "components/transactions/TransactionDetails";

import { EntityModalDecorator } from "utils/storybook";

storiesOf("entities/Transaction", module)
  .addDecorator(StoryRouter())
  .addDecorator(EntityModalDecorator("TRANSACTION"))
  .add("Transaction details", () => (
    <TransactionDetails match={{ params: { transactionId: 0 } }} history={[]} />
  ));
