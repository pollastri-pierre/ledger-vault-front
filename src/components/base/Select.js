// @flow

import React, { PureComponent } from "react";
import ReactSelect from "react-select";
import AsyncReactSelect from "react-select/lib/Async";

import type { PlaceholderProps } from "react-select/lib/types";

import Text from "components/base/Text";
import Box from "components/base/Box";
import colors from "shared/colors";

type Option = {
  value: *,
  label: string
};

type Props = {
  async?: boolean,
  components?: Object,
  options?: Option[]
};

const styles = {
  placeholder: {
    color: colors.shark
  }
};

const Placeholder = (props: PlaceholderProps) => (
  <Box position="absolute">
    <Text style={styles.placeholder}>{props.children}</Text>
  </Box>
);

const customComponents = {
  Placeholder
};

const customStyles = {
  input: styles => ({
    ...styles,
    fontSize: 13
  })
};

class Select extends PureComponent<Props> {
  render() {
    const { async, components, ...props } = this.props;
    const Comp = async ? AsyncReactSelect : ReactSelect;

    return (
      <Comp
        styles={customStyles}
        components={{ ...customComponents, ...components }}
        {...props}
      />
    );
  }
}

export default Select;
