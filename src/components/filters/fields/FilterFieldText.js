// @flow

import React, { PureComponent, createRef } from "react";
import { findDOMNode } from "react-dom";
import TextField from "@material-ui/core/TextField";
import debounce from "lodash/debounce";

import Box from "components/base/Box";

import { FieldTitle, defaultFieldProps } from "components/filters";
import type { FieldProps } from "components/filters";

type Props = FieldProps & {
  title: React$Node,
  placeholder: string,
  queryKey: string
};

class FilterFieldText extends PureComponent<Props> {
  static defaultProps = defaultFieldProps;

  componentDidUpdate(prevProps: Props) {
    const oldValue = prevProps.queryParams[prevProps.queryKey];
    const newValue = this.props.queryParams[this.props.queryKey];
    const needsReset = oldValue && !newValue;
    if (needsReset) {
      clearMaterialInputValue(this.inputRef.current);
    }
  }

  // $FlowFixMe WTF can't you let me create my ref
  inputRef = createRef();

  handleChange = (e: SyntheticInputEvent<*>) =>
    this.debounceUpdate(e.target.value);

  debounceUpdate = debounce((str: string) => {
    const { updateQueryParams, queryKey } = this.props;
    updateQueryParams(queryKey, str);
  }, 150);

  render() {
    const { queryParams, queryKey, placeholder, title } = this.props;

    const isActive = !!queryParams[queryKey];

    return (
      <Box flow={5}>
        <FieldTitle isActive={isActive}>{title}</FieldTitle>
        <TextField
          ref={this.inputRef}
          defaultValue={queryParams[queryKey] || ""}
          onChange={this.handleChange}
          placeholder={placeholder}
        />
      </Box>
    );
  }
}

function clearMaterialInputValue(ref) {
  if (!ref) return;
  const node = findDOMNode(ref); // eslint-disable-line
  if (node && node instanceof HTMLElement) {
    const input = node.querySelector("input");
    if (input && input instanceof HTMLInputElement) {
      input.value = "";
    }
  }
}

export default FilterFieldText;
