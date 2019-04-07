// @flow

import React, { PureComponent } from "react";
import { translate } from "react-i18next";
import type { ObjectParameters, ObjectParameter } from "query-string";

import Text from "components/base/Text";
import Select from "components/base/Select";
import type { TransactionStatus } from "data/types";

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
    const transactionStatuses = resolveTransactionStatuses(queryParams);
    return (
      <Text small>{transactionStatuses.map(s => s.label).join(", ")}</Text>
    );
  };

  render() {
    const { queryParams } = this.props;
    const transactionStatuses = resolveTransactionStatuses(queryParams);
    const isActive = !!transactionStatuses.length;
    return (
      <WrappableField
        width={300}
        label="Status"
        isActive={isActive}
        closeOnChange={transactionStatuses}
        RenderCollapsed={this.Collapsed}
      >
        <SelectTransactionStatuses
          autoFocus
          openMenuOnFocus
          value={transactionStatuses}
          onChange={this.handleChange}
        />
      </WrappableField>
    );
  }
}

function resolveOptions(arr: $ReadOnlyArray<ObjectParameter>): Option[] {
  return arr.map(s => options.find(o => o.value === s)).filter(Boolean);
}

function resolveTransactionStatuses(queryParams: ObjectParameters): Option[] {
  if (!queryParams.status) return [];
  if (typeof queryParams.status === "string")
    return resolveOptions([queryParams.status]);
  if (Array.isArray(queryParams.status))
    return resolveOptions(queryParams.status);
  return [];
}

type Option = {
  value: TransactionStatus,
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

class SelectTransactionStatusesComponent extends PureComponent<SelectProps> {
  render() {
    const { t, ...props } = this.props;

    return (
      <Select
        isMulti
        // $FlowFixMe flow is stupid
        options={options}
        placeholder={t("common:transactionStatus")}
        isClearable
        styles={customStyles}
        {...props}
      />
    );
  }
}

const SelectTransactionStatuses = translate()(
  SelectTransactionStatusesComponent,
);

export default FilterFieldCurrency;
