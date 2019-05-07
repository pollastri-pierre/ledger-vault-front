// @flow
import React from "react";

import Select from "components/base/Select";
import type { UserRole } from "data/types";

export type UserRoleOption = {
  value: UserRole,
  label: string,
};

export const options: UserRoleOption[] = [
  { value: "ADMIN", label: "Administrator" },
  { value: "OPERATOR", label: "Operator" },
];

const SelectUserRole = ({
  value,
  onChange,
  ...rest
}: {
  value: ?UserRoleOption,
  onChange: (?UserRoleOption) => void,
}) => (
  <Select
    isClearable
    // $FlowFixMe wtf
    options={options}
    value={value}
    placeholder="User role"
    onChange={onChange}
    {...rest}
  />
);

export default SelectUserRole;
