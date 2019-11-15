// @flow

import React from "react";
import { BigNumber } from "bignumber.js";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";

import Box from "components/base/Box";
import { InputAmount } from "components/base/form";
import type { RuleThreshold } from "./types";

const FIXME_FORCE_CURRENCY = getCryptoCurrencyById("bitcoin");

type Props = {|
  rule: RuleThreshold,
  onChange: RuleThreshold => void,
|};

const ThresholdParameters = (props: Props) => {
  const { rule, onChange } = props;

  const threshold = rule.data[0];

  if (!threshold) {
    throw new Error("No condition in threshold rule");
  }

  const handleChange = (key: string) => v =>
    onChange({ ...rule, data: [{ ...threshold, [key]: v }] });

  return (
    <Box flow={10}>
      <Box flow={10}>
        <Box>Min:</Box>
        <InputAmount
          width={250}
          autoFocus
          value={threshold.min || BigNumber(0)}
          currency={FIXME_FORCE_CURRENCY}
          onChange={handleChange("min")}
        />
      </Box>
      <Box flow={10}>
        <Box>Max:</Box>
        <InputAmount
          width={250}
          value={threshold.max || BigNumber(0)}
          currency={FIXME_FORCE_CURRENCY}
          onChange={handleChange("max")}
        />
      </Box>
    </Box>
  );
};

export default ThresholdParameters;
