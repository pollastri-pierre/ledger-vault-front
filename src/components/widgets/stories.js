// @flow

import React from "react";
import { storiesOf } from "@storybook/react";

import pageDecorator from "stories/pageDecorator";
import backendDecorator from "stories/backendDecorator";
import {
  TotalBalanceWidget,
  QuorumWidget,
  ActivityWidget,
  AccountsWidget,
  RequestsWidget,
} from "components/widgets";

import { genAccounts, genUsers } from "data/mock-entities";

const users = genUsers(20);
const accounts = genAccounts(10, { users });

const mocks = [
  {
    url: new RegExp("/accounts.*"),
    res: wrap => wrap(accounts),
  },
  {
    url: new RegExp("/requests.*"),
    res: wrap => wrap([]),
  },
  {
    url: "/activity/me",
    res: wrap => wrap([]),
  },
];

storiesOf("widgets", module)
  .addDecorator(pageDecorator)
  .addDecorator(backendDecorator(mocks))
  .add("TotalBalance", () => <TotalBalanceWidget />)
  .add("QuorumWidget", () => <QuorumWidget />)
  .add("ActivityWidget", () => <ActivityWidget />)
  .add("AccountsWidget", () => <AccountsWidget />)
  .add("RequestsWidget", () => <RequestsWidget />);
