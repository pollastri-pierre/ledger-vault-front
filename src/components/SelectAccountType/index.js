// @flow
import React from "react";

import Select from "components/base/Select";
import type { AccountType } from "data/types";

// @flow
export type AccountTypeOption = {
  value: AccountType,
  label: string,
};

export const options: AccountTypeOption[] = [
  { value: "Ethereum", label: "Ethereum" },
  { value: "Bitcoin", label: "Bitcoin" },
  { value: "ERC20", label: "ERC20" },
];

const SelectAccountType = ({
  value,
  onChange,
  ...rest
}: {
  value: ?AccountTypeOption,
  onChange: (?AccountTypeOption) => void,
}) => (
  <Select
    isClearable
    // $FlowFixMe wtf
    options={options}
    value={value}
    placeholder="Crypto asset family"
    onChange={onChange}
    {...rest}
  />
);

export default SelectAccountType;
