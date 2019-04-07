// @flow

import React, { PureComponent } from "react";
import ReactSelect from "react-select";
import AsyncReactSelect from "react-select/lib/Async";

import type { PlaceholderProps } from "react-select/lib/types";

import Text from "components/base/Text";
import Box from "components/base/Box";
import colors, { opacity } from "shared/colors";

type Option = {
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

const boxShadow = "0 2px 2px 1px rgba(0, 0, 0, 0.05)";

const customStyles = {
  input: styles => ({
    ...styles,
    fontSize: 13,
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
    minHeight: 42,
    borderColor: "#dddddd !important",
    borderRadius: 4,
    boxShadow: state.menuIsOpen ? boxShadow : "none",
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomLeftRadius: state.menuIsOpen ? 0 : 4,
    borderBottomRightRadius: state.menuIsOpen ? 0 : 4,
  }),
  valueContainer: (styles, state) => ({
    ...styles,
    padding: state.hasValue && state.isMulti ? 5 : "5px 8px",
  }),
  menu: styles => ({
    ...styles,
    border: "1px solid #dddddd",
    borderTopColor: "#e5e5e5",
    borderTopStyle: "dashed",
    boxShadow,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    marginTop: -1,
    paddingTop: 0,
  }),
  menuList: styles => ({
    ...styles,
    borderTop: "none !important",
    paddingTop: 0,
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
