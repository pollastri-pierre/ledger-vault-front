// @flow

import React, { PureComponent } from "react";
import { withTranslation } from "react-i18next";
import type { ObjectParameters, ObjectParameter } from "query-string";

import Select from "components/base/Select";
import Text from "components/base/Text";
import type { RequestActivityType, Translate } from "data/types";

import { WrappableField, defaultFieldProps } from "components/filters";
import type { FieldProps } from "components/filters";

class FilterFieldRequestActivity extends PureComponent<FieldProps> {
  static defaultProps = defaultFieldProps;

  handleChange = (opt: Option[]) => {
    const { updateQueryParams } = this.props;
    updateQueryParams("type", opt && opt.length ? opt.map(o => o.value) : null);
  };

  Collapsed = () => {
    const { queryParams } = this.props;
    const requestActivity = resolveRequestActivity(queryParams);
    return <Text>{requestActivity.map(a => a.label).join(", ")}</Text>;
  };

  render() {
    const { queryParams } = this.props;
    const requestActivity = resolveRequestActivity(queryParams);
    const isActive = !!requestActivity.length;
    return (
      <WrappableField
        label="Activity"
        isActive={isActive}
        RenderCollapsed={this.Collapsed}
        closeOnChange={requestActivity}
      >
        <SelectRequestActivity
          autoFocus
          openMenuOnFocus
          value={requestActivity}
          onChange={this.handleChange}
        />
      </WrappableField>
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

const SelectRequestActivity = withTranslation()(SelectRequestActivityComponent);

export default FilterFieldRequestActivity;
