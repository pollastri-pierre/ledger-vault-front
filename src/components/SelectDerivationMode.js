// @flow

import React, { useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import type { DerivationMode } from "@ledgerhq/live-common/lib/derivation";

import Select from "components/base/Select";

type Props = {
  derivationModes: DerivationMode[],
  value: ?DerivationMode,
  onChange: DerivationMode => any,
};

const SelectDerivationMode = (props: Props) => {
  const { derivationModes, value, onChange, ...p } = props;
  const { t } = useTranslation();

  const options = useMemo(
    () =>
      derivationModes.map(mode => ({
        label: t(`derivationModes:${mode === "" ? "standard" : mode}`),
        value: mode,
        data: mode,
      })),
    [derivationModes, t],
  );

  const val = useMemo(() => options.find(o => o.value === value) || null, [
    options,
    value,
  ]);

  const handleChange = useCallback(o => onChange(o.value), [onChange]);

  return (
    <Select options={options} value={val} onChange={handleChange} {...p} />
  );
};

export default SelectDerivationMode;
