import React from "react";
import { BigNumber } from "bignumber.js";
import { select, number } from "@storybook/addon-knobs";
import { storiesOf } from "@storybook/react";

import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import BalanceGraph from "components/BalanceGraph";

const bitcoin = getCryptoCurrencyById("bitcoin");

const transactions = [
  {
    type: "SEND",
    amount: BigNumber(5000000),
    fees: BigNumber(0),
    created_on: new Date("2020-01-01 20:12:00").toISOString(),
  },
  {
    type: "SEND",
    amount: BigNumber(6000000),
    fees: BigNumber(0),
    created_on: new Date("2020-01-01 13:12:00").toISOString(),
  },
  {
    type: "SEND",
    amount: BigNumber(7000000),
    fees: BigNumber(0),
    created_on: new Date("2020-01-01 15:12:00").toISOString(),
  },
  {
    type: "SEND",
    amount: BigNumber(8000000),
    fees: BigNumber(0),
    created_on: new Date("2020-01-01 15:38:00").toISOString(),
  },

  {
    type: "SEND",
    amount: BigNumber(5000000),
    fees: BigNumber(0),
    created_on: new Date("2020-01-6 13:12:00").toISOString(),
  },

  {
    type: "SEND",
    amount: BigNumber(5000000),
    fees: BigNumber(0),
    created_on: new Date("2020-01-12 15:12:00").toISOString(),
  },

  {
    type: "RECEIVE",
    amount: BigNumber(5000000),
    fees: BigNumber(0),
    created_on: new Date("2020-01-20 10:12:00").toISOString(),
  },

  {
    type: "RECEIVE",
    amount: BigNumber(5000000),
    fees: BigNumber(0),
    created_on: new Date("2020-01-22 12:12:00").toISOString(),
  },

  {
    type: "SEND",
    amount: BigNumber(15000000),
    fees: BigNumber(0),
    created_on: new Date("2020-01-22 15:12:00").toISOString(),
  },
  {
    type: "SEND",
    amount: BigNumber(15000000),
    fees: BigNumber(0),
    created_on: new Date("2020-01-22 15:30:00").toISOString(),
  },

  {
    type: "RECEIVE",
    amount: BigNumber(16000000),
    fees: BigNumber(0),
    created_on: new Date("2020-01-22 21:16:00").toISOString(),
  },
  {
    type: "RECEIVE",
    amount: BigNumber(17000000),
    fees: BigNumber(0),
    created_on: new Date("2020-01-22 22:18:00").toISOString(),
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

const label = "Granularity";
const defaultValue = "DAY";
const options = {
  DAY: "DAY",
  HOUR: "HOUR",
};

storiesOf("components", module).add("BalanceGraph", () => (
  <div style={{ width: 1000 }}>
    <BalanceGraph
      height={300}
      transactions={transactions}
      account={account}
      nbDays={number("nbDays", 30)}
      granularity={select(label, options, defaultValue)}
    />
  </div>
));
