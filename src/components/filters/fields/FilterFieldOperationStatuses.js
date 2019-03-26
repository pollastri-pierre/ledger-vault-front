// @flow

import React, { PureComponent } from "react";
import { translate } from "react-i18next";
import type { ObjectParameters, ObjectParameter } from "query-string";

import Text from "components/base/Text";
import Select from "components/base/Select";
import type { OperationStatus } from "data/types";

import { WrappableField, defaultFieldProps } from "components/filters";
import type { FieldProps } from "components/filters";

class FilterFieldCurrency extends PureComponent<FieldProps> {
  static defaultProps = defaultFieldProps;

  handleChange = (opt: Option[]) => {
    const { updateQueryParams } = this.props;
    updateQueryParams(
      "status",
      opt && opt.length ? opt.map(o => o.value) : null,
    );
  };

  Collapsed = () => {
    const { queryParams } = this.props;
    const operationStatuses = resolveOperationStatuses(queryParams);
    return <Text small>{operationStatuses.map(s => s.label).join(", ")}</Text>;
  };

  render() {
    const { queryParams } = this.props;
    const operationStatuses = resolveOperationStatuses(queryParams);
    const isActive = !!operationStatuses.length;
    return (
      <WrappableField
        label="Status"
        isActive={isActive}
        closeOnChange={operationStatuses}
        RenderCollapsed={this.Collapsed}
      >
        <SelectOperationStatuses
          autoFocus
          openMenuOnFocus
          value={operationStatuses}
          onChange={this.handleChange}
        />
      </WrappableField>
    );
  }
}

function resolveOptions(arr: $ReadOnlyArray<ObjectParameter>): Option[] {
  return arr.map(s => options.find(o => o.value === s)).filter(Boolean);
}

function resolveOperationStatuses(queryParams: ObjectParameters): Option[] {
  if (!queryParams.status) return [];
  if (typeof queryParams.status === "string")
    return resolveOptions([queryParams.status]);
  if (Array.isArray(queryParams.status))
    return resolveOptions(queryParams.status);
  return [];
}

type Option = {
  value: OperationStatus,
  label: string,
};

const options: Option[] = [
  { value: "SUBMITTED", label: "Confirmed" },
  { value: "ABORTED", label: "Aborted" },
  { value: "PENDING_APPROVAL", label: "Pending approval" },
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
  t: *,
};

class SelectOperationStatusesComponent extends PureComponent<SelectProps> {
  render() {
    const { t, ...props } = this.props;

    return (
      <Select
        isMulti
        // $FlowFixMe flow is stupid
        options={options}
        placeholder={t("common:operationStatus")}
        isClearable
        styles={customStyles}
        {...props}
      />
    );
  }
}

const SelectOperationStatuses = translate()(SelectOperationStatusesComponent);

export default FilterFieldCurrency;
