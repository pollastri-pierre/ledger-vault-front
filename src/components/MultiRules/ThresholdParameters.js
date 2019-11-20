// @flow

import React from "react";
import { BigNumber } from "bignumber.js";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";

import Box from "components/base/Box";
import { InputAmount, Label } from "components/base/form";
import type { RuleThreshold } from "./types";

const FIXME_FORCE_CURRENCY = getCryptoCurrencyById("bitcoin");

type Props = {|
  rule: RuleThreshold,
  onChange: RuleThreshold => void,
|};

const ThresholdParameters = (props: Props) => {
  const { rule, onChange } = props;

  const threshold = rule.data[0];
  const isNoLimit = threshold.max === null;

  if (!threshold) {
    throw new Error("No condition in threshold rule");
  }

  const changeThreshold = threshold => onChange({ ...rule, data: [threshold] });

  const handleChange = (key: string) => v =>
    changeThreshold({ ...threshold, [key]: v });

  const handleNoMaxChange = e => {
    const isChecked = e.target.checked === true;
    changeThreshold({ ...threshold, max: isChecked ? null : BigNumber(0) });
  };

  return (
    <Box flow={40}>
      <Box horizontal flow={20}>
        <Box>
          <Label>Minimum amount</Label>
          <InputAmount
            tabIndex={1}
            unitLeft
            width={220}
            autoFocus
            value={threshold.min || BigNumber(0)}
            currency={FIXME_FORCE_CURRENCY}
            onChange={handleChange("min")}
          />
        </Box>
        <Box>
          <Box horizontal justify="space-between">
            <Label>Maximum amount</Label>
            <div>
              <label style={{ display: "flex", alignItems: "center" }}>
                <input
                  type="checkbox"
                  value="off"
                  onChange={handleNoMaxChange}
                  tabIndex={2}
                  checked={isNoLimit}
                />
                <span>No limit</span>
              </label>
            </div>
          </Box>
          <InputAmount
            tabIndex={1}
            unitLeft
            width={220}
            value={threshold.max || BigNumber(0)}
            currency={FIXME_FORCE_CURRENCY}
            onChange={handleChange("max")}
            isDisabled={isNoLimit}
            hideCV={isNoLimit}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default ThresholdParameters;
