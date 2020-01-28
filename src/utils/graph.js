// @flow
import { BigNumber } from "bignumber.js";
import moment from "moment";

import type { Account, Transaction } from "data/types";

export function ensure(
  {
    onlyIf: condition = true,
    NODES,
    key,
  }: { onlyIf?: boolean, NODES: Object, key: string },
  create: Function,
) {
  if (!condition && NODES[key]) {
    remove(NODES, key);
  }
  if (condition && NODES[key]) {
    remove(NODES, key);
  }
  if (condition && !NODES[key]) {
    append(NODES, key, create());
  }
}

export function remove(NODES: Object, key: string) {
  NODES[key].remove();
  NODES[key] = null;
}

export function append(NODES: Object, key: string, node: Object) {
  NODES[key] = node;
}

const shortenDate = (date: string | Date, granularity: string): string => {
  if (granularity === "DAY") return moment(date).format("YYYY-MM-DD");
  if (granularity === "HOUR") return moment(date).format("YYYY-MM-DD:HH");

  throw Error("Invalid granularity");
};

const groupTransactions = (
  transactions: Transaction[],
  granularity: string,
) => {
  /*
    reformattedTransactions is a HashMap where key is a date ( with or without
    hour depending on the granularity and value an array of transactions
  */
  const reformattedTransactions = {};
  if (!transactions || transactions.length === 0)
    return reformattedTransactions;
  transactions.forEach(transaction => {
    const key = shortenDate(transaction.created_on, granularity);

    if (!reformattedTransactions[key]) reformattedTransactions[key] = [];

    reformattedTransactions[key].push(transaction);
  });

  return reformattedTransactions;
};

const DAY_INCREMENT = 24 * 60 * 60 * 1000;
const HOUR_INCREMENT = 60 * 60 * 1000;

type BuildGraphDataProps = {
  account: Account,
  nbDays: number,
  transactions: Transaction[],
  granularity: string,
};

export const buildGraphData = ({
  account,
  nbDays,
  transactions,
  granularity,
}: BuildGraphDataProps) => {
  const reformattedTransactions = groupTransactions(transactions, granularity);
  const data = [];
  let { balance } = account;
  let today = moment()
    .startOf("day")
    .toDate();

  // Create the first dot
  data.unshift({ date: today, value: balance.toNumber() });

  // Multiplying by 24 to get hour granularity
  for (let i = granularity === "DAY" ? nbDays : nbDays * 24; i > 0; i--) {
    const transactionAtCurrentDate =
      reformattedTransactions[shortenDate(today, granularity)];

    if (transactionAtCurrentDate) {
      // Mark the beginning of a transaction
      data.unshift({ date: today, value: balance.toNumber() });

      const totalSpentToday = transactionAtCurrentDate.reduce(
        (total, currentTransaction) => {
          const { type, amount, fees } = currentTransaction;
          switch (type) {
            case "SEND":
              if (account.account_type === "Erc20")
                return total.plus(amount.plus(fees));
              return total.plus(amount);
            case "RECEIVE":
              return total.minus(amount);
            default:
              return 0;
          }
        },
        new BigNumber(0),
      );
      balance = balance.plus(totalSpentToday);

      // Mark the end of a transaction
      data.unshift({ date: today, value: balance.toNumber() });
    }

    if (granularity === "DAY") {
      today = new Date(today - DAY_INCREMENT);
    }
    if (granularity === "HOUR") {
      today = new Date(today - HOUR_INCREMENT);
    }
  }

  // Create the last dot
  data.unshift({ date: today, value: balance.toNumber() });
  return data;
};
