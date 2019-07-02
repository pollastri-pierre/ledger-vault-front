// @flow

import React from "react";

import { FieldSelect } from "components/filters";
import type { FieldProps } from "components/filters/types";
import type { UserRole } from "data/types";

export type UserRoleOption = {
  value: UserRole,
  label: string,
};

export const options: UserRoleOption[] = [
  { value: "ADMIN", label: "Administrator" },
  { value: "OPERATOR", label: "Operator" },
];

const FilterFieldUserRole = (props: FieldProps) => (
  <FieldSelect
    title="User role"
    placeholder="User role"
    queryKey="role"
    options={options}
    closeMenuOnSelect={false}
    controlShouldRenderValue={false}
    hideSelectedOptions={false}
    withCheckboxes
    width={200}
    {...props}
  />
);

export default FilterFieldUserRole;
