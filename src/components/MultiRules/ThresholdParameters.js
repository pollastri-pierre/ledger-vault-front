// @flow

import React, { useState } from "react";
import { BigNumber } from "bignumber.js";

import type { CurrencyOrToken } from "data/types";
import Select from "components/base/Select";
import Box from "components/base/Box";
import { currencyOrNull, tokenOrNull } from "utils/cryptoCurrencies";
import { InputAmount, InputTokenAmount, Label } from "components/base/form";
import type { Option } from "components/base/Select";
import type { RuleThreshold } from "./types";

type Props = {|
  rule: RuleThreshold,
  currencyOrToken: CurrencyOrToken,
  onChange: (RuleThreshold) => void,
|};

const ThresholdParameters = (props: Props) => {
  const { rule, onChange, currencyOrToken } = props;

  const threshold = rule.data[0];
  const isNoLimit = threshold.max === null;

  const currency = currencyOrNull(currencyOrToken);
  const token = tokenOrNull(currencyOrToken);

  const [unit, setUnit] = useState(currency ? currency.units[0] : null);

  if (!threshold) {
    throw new Error("No condition in threshold rule");
  }

  const changeThreshold = (threshold) =>
    onChange({ ...rule, data: [threshold] });

  const handleChange = (key: string) => (v) =>
    changeThreshold({ ...threshold, [key]: v });

  const handleNoMaxChange = (e) => {
    const isChecked = e.target.checked === true;
    changeThreshold({ ...threshold, max: isChecked ? null : BigNumber(0) });
  };

  const unitsOptions: Option[] = currency
    ? currency.units.map((u) => ({
        label: u.code,
        value: u.code,
        data: u,
      }))
    : [];

  return (
    <Box flow={40}>
      <Box horizontal flow={20} align="flex-start">
        {currency && (
          <Box>
            <Label>Unit</Label>
            <Box width={90}>
              <Select
                tabIndex={-1}
                value={unitsOptions.find((opt) =>
                  unit ? opt.data.code === unit.code : null,
                )}
                options={unitsOptions}
                onChange={(data) => setUnit(data.data)}
              />
            </Box>
          </Box>
        )}
        <Box>
          <Label>Minimum amount</Label>
          {currency ? (
            <Box horizontal flow={8}>
              <InputAmount
                tabIndex={1}
                hideUnit
                width={190}
                unit={unit}
                unitLeft
                autoFocus
                value={threshold.min || BigNumber(0)}
                currency={currency}
                onChange={handleChange("min")}
              />
            </Box>
          ) : token ? (
            <InputTokenAmount
              autoFocus
              value={threshold.min || BigNumber(0)}
              onChange={handleChange("min")}
              token={token}
            />
          ) : null}
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
          {currency ? (
            <InputAmount
              tabIndex={1}
              unitLeft
              hideUnit
              unit={unit}
              width={180}
              value={threshold.max || BigNumber(0)}
              currency={currency}
              onChange={handleChange("max")}
              isDisabled={isNoLimit}
              hideCV={isNoLimit}
              noForceFocus
            />
          ) : token ? (
            <InputTokenAmount
              value={threshold.max || BigNumber(0)}
              onChange={handleChange("max")}
              token={token}
              disabled={isNoLimit}
            />
          ) : null}
        </Box>
      </Box>
    </Box>
  );
};

export default ThresholdParameters;
