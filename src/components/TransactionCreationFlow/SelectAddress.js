// @flow
import React from "react";
import { components } from "react-select";
import Select from "components/base/Select";
import Disabled from "components/Disabled";
import Status from "components/Status";
import Box from "components/base/Box";
import type { Address } from "data/types";
import type { GroupedOption } from "components/base/Select";
import type { OptionProps } from "react-select/src/types";

type Option = {
  value: string,
  label: string,
  data: Address,
};
const customValueStyle = {
  singleValue: styles => ({
    ...styles,
    color: "inherit",
    width: "100%",
    paddingRight: 10,
  }),
};

const addressStyle = {
  backgroundColor: "rgba(0, 0, 0, 0.05)",
  fontSize: 10,
  fontFamily: "monospace",
};
const GroupLabel = data => {
  const { label, isDisabled, whitelist } = data;
  return (
    <Box horizontal justify="space-between">
      <Box>{label}</Box>
      {isDisabled &&
        (whitelist.status === "ACTIVE" && whitelist.last_request ? (
          <Status status={whitelist.last_request.status} />
        ) : (
          <Status status={whitelist.status} size="small" />
        ))}
    </Box>
  );
};
const GenericRow = (props: OptionProps) => {
  const { data } = props.data;
  return (
    <Disabled disabled={props.data.isDisabled}>
      <Box horizontal justify="space-between">
        <Box>{data.name}</Box>
        <Box style={addressStyle} px={10}>
          {data.address}
        </Box>
      </Box>
    </Disabled>
  );
};

const OptionComponent = (props: OptionProps) => (
  <components.Option {...props}>
    <GenericRow {...props} />
  </components.Option>
);
const ValueComponent = (props: OptionProps) => (
  <components.SingleValue {...props}>
    <GenericRow {...props} />
  </components.SingleValue>
);

const customComponents = {
  Option: OptionComponent,
  SingleValue: ValueComponent,
};

type Props = {
  onChange: Option => void,
  value: ?Option,
  options: GroupedOption[],
};
const SelectAddress = (props: Props) => {
  const { value, onChange, options } = props;
  return (
    <Select
      options={options}
      formatGroupLabel={GroupLabel}
      components={customComponents}
      placeholder="Select address"
      onChange={onChange}
      styles={customValueStyle}
      value={value}
    />
  );
};

export default SelectAddress;
