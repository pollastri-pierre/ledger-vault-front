// @flow

import React, { PureComponent } from "react";
import ReactSelect from "react-select";
import AsyncReactSelect from "react-select/async";

import type { PlaceholderProps } from "react-select/src/types";

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

const customComponents = {
  Placeholder,
};

const customStyles = {
  clearIndicator: styles => ({
    ...styles,
    color: "#ddd",
    padding: "5px 0",
  }),
  input: styles => ({
    ...styles,
    fontSize: 13,
    margin: 0,
    marginLeft: 0,
    color: "inherit",
  }),
  singleValue: styles => ({
    ...styles,
    color: "inherit",
  }),
  indicatorSeparator: () => ({}),
  dropdownIndicator: (styles, state) => ({
    ...styles,
    color: "#ddd",
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
        ? colors.form.focus
        : colors.form.border
    } !important`,
    borderRadius: 4,
    boxShadow:
      state.menuIsOpen || state.isFocused ? colors.form.shadow.focus : "none",
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
    borderTopColor: "#e5e5e5",
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
    background: state.isFocused ? opacity(colors.blue, 0.05) : "white",
    "&:hover": {
      background: opacity(colors.blue, 0.05),
    },
    "&:active": {
      background: opacity(colors.blue, 0.09),
    },
  }),
};

class Select extends PureComponent<Props> {
  render() {
    const { async, components, styles, ...props } = this.props;
    const Comp = async ? AsyncReactSelect : ReactSelect;

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
