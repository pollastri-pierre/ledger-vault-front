// @flow

import React, { PureComponent } from "react";
import { translate } from "react-i18next";
import type { ObjectParameters, ObjectParameter } from "query-string";

import Box from "components/base/Box";
import Select from "components/base/Select";
import type { RequestStatus, Translate } from "data/types";

import { FieldTitle, defaultFieldProps } from "components/filters";
import type { FieldProps } from "components/filters";

class FilterFieldRequestStatuses extends PureComponent<FieldProps> {
  static defaultProps = defaultFieldProps;

  handleChange = (opt: Option[]) => {
    const { updateQueryParams } = this.props;
    updateQueryParams(
      "status",
      opt && opt.length ? opt.map(o => o.value) : null,
    );
  };

  render() {
    const { queryParams } = this.props;
    const operationStatuses = resolveRequestStatuses(queryParams);
    const isActive = !!operationStatuses.length;
    return (
      <Box flow={5}>
        <FieldTitle isActive={isActive}>Status</FieldTitle>
        <SelectRequestStatuses
          value={operationStatuses}
          onChange={this.handleChange}
        />
      </Box>
    );
  }
}

function resolveOptions(arr: $ReadOnlyArray<ObjectParameter>): Option[] {
  return arr.map(s => options.find(o => o.value === s)).filter(Boolean);
}

function resolveRequestStatuses(queryParams: ObjectParameters): Option[] {
  if (!queryParams.status) return [];
  if (typeof queryParams.status === "string")
    return resolveOptions([queryParams.status]);
  if (Array.isArray(queryParams.status))
    return resolveOptions(queryParams.status);
  return [];
}

type Option = {
  value: RequestStatus,
  label: string,
};

const options: Option[] = [
  { value: "APPROVED", label: "Approved" },
  { value: "ABORTED", label: "Aborted" },
  { value: "PENDING_APPROVAL", label: "Pending approval" },
  { value: "PENDING_REGISTRATION", label: "Pending registration" },
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

class SelectRequestStatusesComponent extends PureComponent<SelectProps> {
  render() {
    const { t, ...props } = this.props;

    return (
      <Select
        isMulti
        // $FlowFixMe flow is stupid
        options={options}
        placeholder={t("common:requestStatus")}
        isClearable
        styles={customStyles}
        {...props}
      />
    );
  }
}

const SelectRequestStatuses = translate()(SelectRequestStatusesComponent);

export default FilterFieldRequestStatuses;
