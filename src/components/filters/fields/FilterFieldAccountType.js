// @flow

import React from "react";

import { FieldSelect } from "components/filters";
import type { AccountType } from "data/types";
import type { FieldProps } from "components/filters/types";

type AccountTypeOption = {
  value: AccountType,
  label: string,
};

const options: AccountTypeOption[] = [
  { value: "Ethereum", label: "Ethereum" },
  { value: "Bitcoin", label: "Bitcoin" },
  { value: "ERC20", label: "ERC20" },
];

const FilterFieldAccountType = (props: FieldProps) => (
  <FieldSelect
    title="Crypto asset family"
    placeholder="Crypto asset family"
    queryKey="account_type"
    options={options}
    closeMenuOnSelect={false}
    controlShouldRenderValue={false}
    hideSelectedOptions={false}
    withCheckboxes
    width={200}
    {...props}
  />
);

export default FilterFieldAccountType;
