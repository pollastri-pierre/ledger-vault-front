// @flow
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

type BuildGraphDataProps = {
  account: Account,
  nbDays: number,
  transactions: Transaction[],
};

const sortTransactions = transactions => {
  const res = [...transactions];
  res.sort((a, b) => (moment(a.created_on).isBefore(b.created_on) ? 1 : -1));
  return res;
};
export const buildGraphData = ({
  account,
  nbDays,
  transactions,
}: BuildGraphDataProps) => {
  const sortedTransactions = sortTransactions(transactions);

  const rangeDateMin = moment()
    .subtract(nbDays, "days")
    .startOf("day");
  const rangeDateMax = moment().startOf("day");

  let { balance } = account;

  const data = [
    {
      date: rangeDateMax.valueOf(),
      value: balance.toNumber(),
      dateClean: moment(rangeDateMax).format("YYYY MM DD HH:mm:ss"),
    },

    ...sortedTransactions
      .filter(tx => moment(tx.created_on).isBetween(rangeDateMin, rangeDateMax))
      .map(tx => {
        const { type, amount, fees } = tx;
        switch (type) {
          case "SEND":
            if (account.account_type === "Erc20")
              balance = balance.plus(amount.plus(fees));
            balance = balance.plus(amount);
            break;
          case "RECEIVE":
            balance = balance.minus(amount);
            break;
          default:
            break;
        }

        return {
          date: moment(tx.created_on).valueOf(),
          value: balance.toNumber(),
          dateClean: moment(tx.created_on).format("YYYY MM DD HH:mm:ss"),
        };
      }),
    {
      date: rangeDateMin.valueOf(),
      value: balance.toNumber(),
      dateClean: moment(rangeDateMin).format("YYYY MM DD HH:mm:ss"),
    },
  ];

  return data;
};
