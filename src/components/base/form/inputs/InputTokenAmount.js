// @flow

import React, { useState, useMemo, useCallback } from "react";
import { BigNumber } from "bignumber.js";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";

import { getCurrencyLikeUnit } from "utils/cryptoCurrencies";
import { sanitizeValueString } from "utils/strings";
import { InputText } from "components/base/form";
import type { ERC20Token } from "data/types";

type Props = {
  token: ERC20Token,
  value: BigNumber,
  onChange: (BigNumber) => void,
};

function InputTokenAmount(props: Props) {
  const { token, value, onChange, ...p } = props;

  const unit = useMemo(() => getCurrencyLikeUnit(token), [token]);

  const [displayValue, setDisplayValue] = useState(
    sanitizeInitialValue(value, unit),
  );

  const onChangeText = useCallback(
    (amount) => {
      const r = sanitizeValueString(unit, amount);
      const value = BigNumber(r.value);
      onChange(value);
      setDisplayValue(r.display);
    },
    [unit, onChange],
  );

  return (
    <InputText
      value={displayValue}
      align="right"
      data-test="input-amount"
      placeholder="0"
      {...p}
      onChange={onChangeText}
    />
  );
}

function sanitizeInitialValue(value, unit) {
  const val = formatCurrencyUnit(unit, value, { disableRounding: true });
  return parseFloat(val) > 0 ? val : "";
}

export default InputTokenAmount;
