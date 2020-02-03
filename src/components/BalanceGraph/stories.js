import React from "react";
import { BigNumber } from "bignumber.js";
import { number } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";

import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import BalanceGraph from "components/BalanceGraph";
import moment from "moment";

const bitcoin = getCryptoCurrencyById("bitcoin");

const transactions = [
  {
    type: "SEND",
    amount: BigNumber(5000000),
    fees: BigNumber(0),
    created_on: moment()
      .subtract(29, "days")
      .toString(),
  },
  {
    type: "SEND",
    amount: BigNumber(6000000),
    fees: BigNumber(0),
    created_on: moment()
      .subtract(28, "days")
      .toString(),
  },
  {
    type: "SEND",
    amount: BigNumber(7000000),
    fees: BigNumber(0),
    created_on: moment()
      .subtract(27, "days")
      .toString(),
  },
  {
    type: "SEND",
    amount: BigNumber(8000000),
    fees: BigNumber(0),
    created_on: moment()
      .subtract(20, "days")
      .toString(),
  },

  {
    type: "SEND",
    amount: BigNumber(5000000),
    fees: BigNumber(0),
    created_on: moment()
      .subtract(18, "days")
      .toString(),
  },

  {
    type: "SEND",
    amount: BigNumber(5000000),
    fees: BigNumber(0),
    created_on: moment()
      .subtract(16, "days")
      .toString(),
  },

  {
    type: "RECEIVE",
    amount: BigNumber(5000000),
    fees: BigNumber(0),
    created_on: moment()
      .subtract(6, "days")
      .toString(),
  },

  {
    type: "RECEIVE",
    amount: BigNumber(5000000),
    fees: BigNumber(0),
    created_on: moment()
      .subtract(5, "days")
      .toString(),
  },

  {
    type: "SEND",
    amount: BigNumber(15000000),
    fees: BigNumber(0),
    created_on: moment()
      .subtract(4, "days")
      .toString(),
  },
  {
    type: "SEND",
    amount: BigNumber(15000000),
    fees: BigNumber(0),
    created_on: moment()
      .subtract(3, "days")
      .toString(),
  },
];

const account = {
  account_type: "Bitcoin",
  currency: "bitcoin",
  balance: BigNumber(100000000),
  settings: {
    currency_unit: bitcoin.units[0],
  },
};

storiesOf("components", module).add("BalanceGraph", () => (
  <BalanceGraph
    height={300}
    transactions={transactions}
    account={account}
    nbDays={number("nbDays", 30)}
  />
));
