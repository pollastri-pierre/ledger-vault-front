// @flow

import React, { PureComponent, createRef } from "react";
import { findDOMNode } from "react-dom";
import debounce from "lodash/debounce";

import { WrappableField, defaultFieldProps } from "components/filters";
import type { FieldProps } from "components/filters";
import Text from "components/base/Text";
import { InputText } from "components/base/form";

type Props = FieldProps & {
  title: React$Node,
  placeholder: string,
  queryKey: string,
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

  handleChange = (v: string) => this.debounceUpdate(v);

  debounceUpdate = debounce((str: string) => {
    const { updateQueryParams, queryKey } = this.props;
    updateQueryParams(queryKey, str);
  }, 150);

  Collapsed = () => {
    const { queryParams, queryKey } = this.props;
    return <Text small>{queryParams[queryKey] || ""}</Text>;
  };

  render() {
    const { queryParams, queryKey, placeholder, title } = this.props;

    const isActive = !!queryParams[queryKey];

    return (
      <WrappableField
        label={title}
        isActive={isActive}
        RenderCollapsed={this.Collapsed}
      >
        <InputText
          ref={this.inputRef}
          autoFocus
          defaultValue={queryParams[queryKey] || ""}
          onChange={this.handleChange}
          placeholder={placeholder}
        />
      </WrappableField>
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
