// @flow
import React, { useState } from "react";
import { MdKeyboardReturn } from "react-icons/md";
import { components } from "react-select";
import type { OptionProps } from "react-select/src/types";

import Select from "components/base/Select";
import Disabled from "components/Disabled";
import Status from "components/Status";
import Box from "components/base/Box";
import Key from "components/base/Key";
import type { Address } from "data/types";
import type { GroupedOption } from "components/base/Select";
import ErrorsWrapper from "components/base/form/ErrorsWrapper";
import colors from "shared/colors";

type Option = {
  value: string,
  label: string,
  data: Address,
};

type Props = {
  onChange: Option => void,
  value: ?Option,
  options: GroupedOption[],
  canAddCustom: boolean,
  errors?: Error[],
  warnings?: Error[],
};

export const CREATED_ADDRESS_UNIQUE_LABEL = "__VAULT_CUSTOM_ADDRESS__";

const SelectAddress = (props: Props) => {
  const {
    value,
    onChange,
    options,
    canAddCustom,
    errors,
    warnings,
    ...p
  } = props;
  const [isFocused, setFocused] = useState(false);
  const [isOpened, setOpened] = useState(false);

  const hasError = !!errors && !!errors.length;
  const hasWarning = !hasError && !!warnings && !!warnings.length;

  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);
  const handleMenuOpen = () => setOpened(true);
  const handleMenuClose = () => setOpened(false);

  const showError = isFocused && !isOpened;

  // used to hide the custom option if we type exactly a maching address
  const isValidNewOption = inputValue =>
    !!inputValue && !isValueInOptions(inputValue, options);

  const isCurrentCustom = value && value.label === CREATED_ADDRESS_UNIQUE_LABEL;

  return (
    <Box position="relative">
      <Select
        hideSelectedOptions={isCurrentCustom}
        creatable={canAddCustom}
        isValidNewOption={isValidNewOption}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onMenuOpen={handleMenuOpen}
        onMenuClose={handleMenuClose}
        options={options}
        formatGroupLabel={GroupLabel}
        components={customComponents}
        noOptionsMessage={NoOptionsMessage}
        placeholder="Select address"
        onChange={onChange}
        styles={customValueStyle}
        value={value}
        hasError={hasError}
        hasWarning={hasWarning}
        {...p}
      />
      {showError && (
        <>
          <ErrorsWrapper errors={errors} />
          <ErrorsWrapper
            errors={hasWarning ? warnings : undefined}
            bg={colors.form.warning}
          />
        </>
      )}
    </Box>
  );
};

const NoOptionsMessage = () => "No addresses";

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
  borderRadius: 4,
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
  if (props.data.__isNew__) {
    return (
      <Box horizontal align="center" flow={20}>
        <Box horizontal align="center" flow={5} grow>
          <span style={{ flexShrink: 0, whiteSpace: "nowrap" }}>
            {"Send to"}
          </span>
          <Box ellipsis style={{ fontWeight: "bold" }}>
            {props.data.value}
          </Box>
        </Box>
        <Box noShrink>
          <Key>
            <span>Enter</span>
            <MdKeyboardReturn />
          </Key>
        </Box>
      </Box>
    );
  }
  const { data } = props.data;

  // let's assume that if the address does not have any `id` it's because
  // it is a custom one just added by the user
  const isCustomAddress = !("id" in data);

  if (isCustomAddress) {
    return <Box>{data.address}</Box>;
  }

  return (
    <Disabled disabled={props.data.isDisabled}>
      <Box horizontal justify="space-between">
        <Box noShrink>{data.name}</Box>
        <Box ellipsis style={addressStyle} ml={5} px={5}>
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

function isValueInOptions(value: string, options: GroupedOption[]) {
  return options.some(group =>
    group.options.some(option => option.data.address === value),
  );
}

export default SelectAddress;
