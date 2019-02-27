// @flow

import React, { PureComponent, createRef } from "react";
import { findDOMNode } from "react-dom";
import TextField from "@material-ui/core/TextField";
import debounce from "lodash/debounce";
// import type { ObjectParameters, ObjectParameter } from "query-string";

import Box from "components/base/Box";

import FieldTitle from "./FieldTitle";
import { defaultFieldProps } from "../FiltersCard";
import type { FieldProps } from "../FiltersCard";

type Props = FieldProps & {
  title: React$Node,
  placeholder: string,
  queryKey: string
};

class FilterFieldText extends PureComponent<Props> {
  static defaultProps = defaultFieldProps;

  componentDidUpdate(prevProps: Props) {
    const oldValue = prevProps.query[prevProps.queryKey];
    const newValue = this.props.query[this.props.queryKey];
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
    const { updateQuery, queryKey } = this.props;
    updateQuery(queryKey, str);
  }, 150);

  render() {
    const { query, queryKey, placeholder, title } = this.props;

    const isActive = !!query[queryKey];

    return (
      <Box flow={5}>
        <FieldTitle isActive={isActive}>{title}</FieldTitle>
        <TextField
          ref={this.inputRef}
          defaultValue={query[queryKey] || ""}
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
