// @flow
import React from "react";
import { BigNumber } from "bignumber.js";

import type { Account } from "data/types";
import colors from "shared/colors";

import CounterValue from "components/CounterValue";
import Box from "components/base/Box";
import Text from "components/base/Text";
import CurrencyAccountValue from "./CurrencyAccountValue";

type Props = {
  account: Account,
  value: BigNumber,
  dataTest?: ?string,
  strong?: boolean,
  disableERC20?: boolean,
  hideCountervalue?: boolean,
  smallerInnerMargin?: boolean,
};

export default function Amount(props: Props) {
  const {
    account,
    value,
    strong,
    dataTest,
    disableERC20,
    hideCountervalue,
    smallerInnerMargin,
  } = props;

  const cvProps = {};
  if (disableERC20) {
    Object.assign(cvProps, { from: account.currency });
  } else {
    Object.assign(cvProps, { fromAccount: account });
  }
  Object.assign(cvProps, { smallerInnerMargin });
  return (
    <Box horizontal align="center" justify="center" flow={5}>
      <Text
        color={colors.black}
        data-test={dataTest}
        fontWeight={strong ? "bold" : null}
        lineHeight={1}
      >
        <CurrencyAccountValue
          account={account}
          value={value}
          disableERC20={disableERC20}
        />
      </Text>
      {!hideCountervalue && (
        <Text size="small" color={colors.steel} lineHeight={1}>
          {"("}
          <CounterValue value={value} {...cvProps} />
          {")"}
        </Text>
      )}
    </Box>
  );
}
