// @flow

import React, { PureComponent } from "react";
import { translate } from "react-i18next";
import type { ObjectParameters, ObjectParameter } from "query-string";

import Box from "components/base/Box";
import Select from "components/base/Select";
import type { RequestActivityType, Translate } from "data/types";

import { FieldTitle, defaultFieldProps } from "components/filters";
import type { FieldProps } from "components/filters";

class FilterFieldRequestActivity extends PureComponent<FieldProps> {
  static defaultProps = defaultFieldProps;

  handleChange = (opt: Option[]) => {
    const { updateQueryParams } = this.props;
    updateQueryParams("type", opt && opt.length ? opt.map(o => o.value) : null);
  };

  render() {
    const { queryParams } = this.props;
    const operationActivity = resolveRequestActivity(queryParams);
    const isActive = !!operationActivity.length;
    return (
      <Box flow={5}>
        <FieldTitle isActive={isActive}>Activity</FieldTitle>
        <SelectRequestActivity
          value={operationActivity}
          onChange={this.handleChange}
        />
      </Box>
    );
  }
}

function resolveOptions(arr: $ReadOnlyArray<ObjectParameter>): Option[] {
  return arr.map(s => options.find(o => o.value === s)).filter(Boolean);
}

function resolveRequestActivity(queryParams: ObjectParameters): Option[] {
  if (!queryParams.type) return [];
  if (typeof queryParams.type === "string")
    return resolveOptions([queryParams.type]);
  if (Array.isArray(queryParams.type)) return resolveOptions(queryParams.type);
  return [];
}

type Option = {
  value: RequestActivityType,
  label: string,
};

const options: Option[] = [
  { value: "CREATE_GROUP", label: "Create Group" },
  { value: "EDIT_GROUP", label: "Edit Group" },
  { value: "REVOKE_GROUP", label: "Revoke Group" },
  { value: "REVOKE_USER", label: "Revoke User" },
  { value: "CREATE_ADMIN", label: "Create Admin" },
  { value: "CREATE_OPERATOR", label: "Create Operator" },
  { value: "CREATE_ACCOUNT", label: "Create Account" },
  { value: "EDIT_ACCOUNT", label: "Edit Account" },
  { value: "REVOKE_ACCOUNT", label: "Revoke Account" },
];

const customStyles = {
  menuList: p => ({
    ...p,
    fontSize: 13,
  }),
};

type SelectProps = {
  value: Option[],
  onChange: (Option[]) => void,
  t: Translate,
};

class SelectRequestActivityComponent extends PureComponent<SelectProps> {
  render() {
    const { t, ...props } = this.props;

    return (
      <Select
        isMulti
        // $FlowFixMe flow is stupid
        options={options}
        placeholder={t("common:requestActivity")}
        isClearable
        styles={customStyles}
        {...props}
      />
    );
  }
}

const SelectRequestActivity = translate()(SelectRequestActivityComponent);

export default FilterFieldRequestActivity;