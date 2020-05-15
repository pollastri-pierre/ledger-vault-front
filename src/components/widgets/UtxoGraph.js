// @flow

import React, { useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import BigNumber from "bignumber.js";
import {
  getCryptoCurrencyById,
  formatCurrencyUnit,
} from "@ledgerhq/live-common/lib/currencies";
import { FaMinus, FaPlus } from "react-icons/fa";

import { useMe } from "components/UserContextProvider";
import type { Connection } from "restlay/ConnectionQuery";
import colors from "shared/colors";
import AccountUTXOQuery from "api/queries/AccountUTXOQuery";
import Button from "components/base/Button";
import Box from "components/base/Box";
import BarCharts from "components/BarCharts";
import type { UTXO, Account } from "data/types";
import { SoftCard } from "components/base/Card";
import { isAccountSpendable } from "utils/transactions";
import Widget, { connectWidget } from "./Widget";

type Props = {
  utxo: Connection<UTXO>,
  account: Account,
};

const STEP = 5;
const MIN = 5;

const UtxoGraph = (props: Props) => {
  const { utxo, account } = props;
  const [granularity, setGranularity] = useState(30);

  const me = useMe();

  const data = useMemo(
    () => utxo.edges.map((e) => ({ ...e.node, value: e.node.amount })),
    [utxo],
  );

  const bitcoin = getCryptoCurrencyById("bitcoin");
  const colorsGraph = useMemo(
    () => ({
      main: bitcoin.color,
      hover: colors.bgHover,
    }),
    [bitcoin],
  );

  const increaseGranularity = useCallback(() => {
    setGranularity(granularity + STEP);
  }, [granularity, setGranularity]);

  const tooltipFormatter = useCallback(
    (value) => {
      const split = value.split("-");
      const v = `${formatCurrencyUnit(
        bitcoin.units[0],
        BigNumber(split[0]),
      )}-${formatCurrencyUnit(bitcoin.units[0], BigNumber(split[1]))} BTC`;
      return v;
    },
    [bitcoin],
  );

  const decreaseGranularity = useCallback(() => {
    const decrease = granularity - STEP;
    setGranularity(decrease >= MIN ? decrease : MIN);
  }, [granularity, setGranularity]);

  const isSendDisabled = !isAccountSpendable(account);

  const sendBtn = (
    <Button size="small" type="filled" disabled={isSendDisabled}>
      <Box horizontal flow={5} align="center">
        Consolidate
      </Box>
    </Button>
  );

  return (
    <Widget title="Utxo distribution of your account">
      <SoftCard>
        <Box flow={20}>
          <Box horizontal align="center" flow={20} alignSelf="flex-end">
            {me.role === "OPERATOR" ? (
              isSendDisabled ? (
                sendBtn
              ) : (
                <Link to={`${account.id}/send/${account.id}`}>{sendBtn}</Link>
              )
            ) : (
              false
            )}
            <ZoomContainer>
              <Button size="small" onClick={decreaseGranularity}>
                <FaMinus />
              </Button>
              <Button size="small" onClick={increaseGranularity}>
                <FaPlus />
              </Button>
            </ZoomContainer>
          </Box>
          <BarCharts
            data={data}
            granularity={granularity}
            height={350}
            colors={colorsGraph}
            tooltipFormatter={tooltipFormatter}
          />
        </Box>
      </SoftCard>
    </Widget>
  );
};

const ZoomContainer = styled(Box).attrs({
  horizontal: true,
  flow: 10,
})``;

export default connectWidget(UtxoGraph, {
  height: 426,
  queries: {
    utxo: AccountUTXOQuery,
  },
  propsToQueryParams: ({ account }: { account: Account }) => {
    return {
      account: [account.id],
    };
  },
});
