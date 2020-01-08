// @flow

import React, { PureComponent } from "react";
import styled from "styled-components";
import ReactSelect, { components } from "react-select";
import AsyncReactSelect from "react-select/async";
import CreatableReactSelect from "react-select/creatable";

import type {
  PlaceholderProps,
  DropdownIndicatorProps,
} from "react-select/src/types";

import Text from "components/base/Text";
import Box from "components/base/Box";
import colors, { opacity } from "shared/colors";

export type Option = {
  value: string,
  data: *,
  label: string,
};

export type GroupedOption = {
  label: string,
  options: Option[],
};

type Props = {
  async?: boolean,
  creatable?: boolean,
  options?: Option[] | GroupedOption[],
  components?: Object,
  styles?: Object,
};

const styles = {
  placeholder: {
    color: colors.mediumGrey,
    paddingLeft: 2,
  },
};

const Placeholder = (props: PlaceholderProps) => (
  <Box position="absolute">
    <Text style={styles.placeholder}>{props.children}</Text>
  </Box>
);

const ChevronContainer = styled.div`
  color: ${colors.legacyLightGrey7};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 30px;
  transition: 300ms ease transform;
  &:hover {
    // taken from react-select
    color: hsl(0, 0%, 60%);
  }
`;

const DropdownIndicator = (props: DropdownIndicatorProps) => (
  <ChevronContainer
    style={{
      transform: `rotate(${props.selectProps.menuIsOpen ? -180 : 0}deg)`,
    }}
    data-test="select-arrow"
  >
    <components.DownChevron />
  </ChevronContainer>
);

const customComponents = {
  Placeholder,
  DropdownIndicator,
};

const customStyles = {
  clearIndicator: styles => ({
    ...styles,
    color: colors.legacyLightGrey7,
    padding: "5px 0",
  }),
  input: styles => ({
    ...styles,
    fontSize: 13,
    margin: 0,
    marginLeft: 2,
    color: "inherit",
  }),
  singleValue: styles => ({
    ...styles,
    color: "inherit",
  }),
  indicatorSeparator: () => ({}),
  dropdownIndicator: (styles, state) => ({
    ...styles,
    color: colors.legacyLightGrey7,
    transition: "300ms ease transform",
    transform: state.selectProps.menuIsOpen
      ? "rotate(-180deg)"
      : "rotate(0deg)",
  }),
  control: (styles, state) => ({
    ...styles,
    minHeight: 40,
    borderColor: `${
      state.menuIsOpen || state.isFocused
        ? state.selectProps.hasError
          ? colors.form.error
          : state.selectProps.hasError
          ? colors.form.warning
          : colors.form.focus
        : colors.form.border
    } !important`,
    borderRadius: 4,
    boxShadow:
      state.menuIsOpen || state.isFocused
        ? state.selectProps.hasError
          ? colors.form.shadow.error
          : state.selectProps.hasWarning
          ? colors.form.shadow.warning
          : colors.form.shadow.focus
        : "none",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: state.menuIsOpen ? 0 : 4,
    borderBottomRightRadius: state.menuIsOpen ? 0 : 4,
  }),
  valueContainer: styles => ({
    ...styles,
    padding: "5px 8px",
  }),
  menu: styles => ({
    ...styles,
    border: `1px solid ${colors.form.focus}`,
    borderTopColor: colors.legacyLightGrey8,
    borderTopStyle: "dashed",
    boxShadow: colors.form.shadow.focus,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    overflow: "hidden",
    marginTop: -1,
    marginBottom: 0,
    paddingTop: 0,
    paddingBottom: 0,
  }),
  menuList: styles => ({
    ...styles,
    borderTop: "none !important",
    paddingTop: 0,
    paddingBottom: 0,
  }),
  option: (styles, state) => ({
    ...styles,
    color: "",
    background: state.isFocused ? opacity(colors.bLive, 0.05) : "white",
    "&:hover": {
      background: opacity(colors.bLive, 0.05),
    },
    "&:active": {
      background: opacity(colors.bLive, 0.09),
    },
  }),
};

class Select extends PureComponent<Props> {
  render() {
    const { async, creatable, components, styles, ...props } = this.props;
    const Comp = creatable
      ? CreatableReactSelect
      : async
      ? AsyncReactSelect
      : ReactSelect;

    return (
      <Comp
        styles={{ ...customStyles, ...styles }}
        components={{ ...customComponents, ...components }}
        {...props}
      />
    );
  }
}

export default Select;
