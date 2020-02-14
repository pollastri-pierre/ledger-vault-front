// @flow

import React from "react";
import BigNumber from "bignumber.js";
import { storiesOf } from "@storybook/react";

import pageDecorator from "stories/pageDecorator";
import backendDecorator from "stories/backendDecorator";
import {
  TotalBalanceWidget,
  QuorumWidget,
  ActivityWidget,
  AccountsWidget,
  RequestsWidget,
  UtxoGraphWidget,
} from "components/widgets";

import { genAccounts, genUsers, genUtxos } from "data/mock-entities";

const users = genUsers(20);
const accounts = genAccounts(10, { users });
const utxos = genUtxos(100);

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
  {
    url: "/utxos-mocks?pageSize=-1",
    res: wrap => wrap(utxos),
  },
];

storiesOf("widgets", module)
  .addDecorator(pageDecorator)
  .addDecorator(backendDecorator(mocks))
  .add("TotalBalance", () => <TotalBalanceWidget />)
  .add("QuorumWidget", () => <QuorumWidget />)
  .add("ActivityWidget", () => <ActivityWidget />)
  .add("AccountsWidget", () => <AccountsWidget />)
  .add("RequestsWidget", () => <RequestsWidget />)
  .add("UtxoGraph", () => (
    <UtxoGraphWidget account={{ id: 1, balance: BigNumber(2) }} />
  ));
