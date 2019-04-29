/* eslint-disable react/prop-types */

import React from "react";
import { storiesOf } from "@storybook/react";
import StoryRouter from "storybook-react-router";

import AccountDetails from "containers/Accounts/AccountDetails";

import { EntityModalDecorator } from "utils/storybook";

storiesOf("entities/Account", module)
  .addDecorator(StoryRouter())
  .addDecorator(EntityModalDecorator("ACCOUNT"))
  .add("Account details", () => (
    <AccountDetails match={{ params: { accountId: 0 } }} history={[]} />
  ));
