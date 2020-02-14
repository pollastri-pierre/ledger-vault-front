// @flow

import React, { useEffect, useMemo, useRef, useState } from "react";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import moment from "moment";
import { BigNumber } from "bignumber.js";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";

import { getAccountCurrencyUnit } from "data/currency";
import { currencyUnitValueFormat } from "components/CurrencyUnitValue";
import {
  getCurrencyLikeUnit,
  getERC20TokenByContractAddress,
} from "utils/cryptoCurrencies";
import { buildGraphData } from "utils/graph";
import type { Account, Transaction } from "data/types";
import colors, { opacity } from "shared/colors";

type Props = {|
  height: number,
  transactions: Transaction[],
  account: Account,
  nbDays: number,
|};

const BalanceGraph = (props: Props) => {
  const { height, transactions, account, nbDays } = props;

  const [width, setWidth] = useState(0);
  const containerRef = useRef();

  const isERC20 = account.account_type === "Erc20";

  const { color } = isERC20
    ? getCryptoCurrencyById("ethereum")
    : getCryptoCurrencyById(account.currency);

  const data = useMemo(
    () => buildGraphData({ account, nbDays, transactions }),
    [account, nbDays, transactions],
  );

  useEffect(() => {
    const resizeWidth = () => {
      setWidth(containerRef.current ? containerRef.current.offsetWidth : 0);
    };
    resizeWidth();
    window.addEventListener("resize", resizeWidth);

    return () => {
      window.removeEventListener("resize", resizeWidth);
    };
  }, []);

  return (
    <div ref={containerRef}>
      <AreaChart
        data={data}
        width={width}
        height={height}
        margin={{ top: 20, right: 30, bottom: 0, left: 30 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip
          labelFormatter={date =>
            moment(date)
              .format("MM/DD HH:mm:ss")
              .toString()
          }
          formatter={balance => [
            currencyUnitValueFormat(
              getAccountCurrencyUnit(account),
              BigNumber(balance),
            ),
          ]}
        />
        <YAxis
          dataKey="value"
          axisLine={false}
          tickLine={false}
          tick={{ fill: colors.textLight }}
          tickFormatter={value => {
            if (isERC20) {
              const token = getERC20TokenByContractAddress(
                account.contract_address,
              );
              return currencyUnitValueFormat(
                getCurrencyLikeUnit(token),
                BigNumber(value),
              );
            }
            return currencyUnitValueFormat(
              getAccountCurrencyUnit(account),
              BigNumber(value),
            );
          }}
        />

        <XAxis
          dataKey="date"
          tickLine={false}
          tick={{ fill: colors.textLight }}
          stroke={colors.lightGrey}
          domain={[data[data.length - 1].date, data[0].date]}
          type="number"
          name="Time"
          tickFormatter={date =>
            moment(data[data.length - 1].date).isSame(date)
              ? ""
              : moment(date)
                  .format("MM/DD")
                  .toString()
          }
        />
        <Area
          isAnimationActive={false}
          type="stepAfter"
          dataKey="value"
          stroke={color}
          fill={opacity(color, 0.2)}
        />
      </AreaChart>
    </div>
  );
};

export default BalanceGraph;
