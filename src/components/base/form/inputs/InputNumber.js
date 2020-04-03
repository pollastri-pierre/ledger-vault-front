// @flow

import React, { useCallback, useMemo } from "react";
import { BigNumber } from "bignumber.js";
import type { Unit } from "@ledgerhq/live-common/lib/types";

import { InputText } from "components/base/form";
import { sanitizeValueString } from "utils/strings";
import type { InputProps, Icon, Alignment } from "components/base/form/types";

type Props = InputProps<number> & {
  IconLeft?: React$ComponentType<Icon>,
  autoFocus?: boolean,
  maxLength?: number,
  onlyAscii?: boolean,
  align?: Alignment,
  grow?: boolean,
  max?: number,
  inputRef?: *,
  onFocus?: () => void,
  onBlur?: () => void,
};

// $FlowFixMe intended to not have full unit, it's only for formatting purpose
const ZERO_MAGNITUDE_UNIT: Unit = { magnitude: 0 };

const InputNumber = (props: Props) => {
  const { value, onChange, max, ...p } = props;

  const strValue = useMemo(() => (value === 0 ? "" : value.toString()), [
    value,
  ]);

  const handleChange = useCallback(
    str => {
      const r = sanitizeValueString(ZERO_MAGNITUDE_UNIT, str);
      const bigNumberValue = BigNumber(r.value);
      onChange(
        bigNumberValue.gt(Number.MAX_SAFE_INTEGER)
          ? Number.MAX_SAFE_INTEGER
          : max
          ? Math.min(Number(r.value), max)
          : Number(r.value),
      );
    },
    [onChange, max],
  );

  return (
    <InputText
      value={strValue}
      onChange={handleChange}
      align="right"
      placeholder="0"
      {...p}
    />
  );
};

export default InputNumber;
