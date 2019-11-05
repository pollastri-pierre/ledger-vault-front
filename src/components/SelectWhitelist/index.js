// @flow

import React, { PureComponent } from "react";
import { components } from "react-select";
import type { OptionProps } from "react-select/src/types";

import { withTranslation } from "react-i18next";
import Disabled from "components/Disabled";

import type { Translate, Whitelist } from "data/types";
import Select from "components/base/Select";
import Box from "components/base/Box";
import Text from "components/base/Text";

type Props = {
  t: Translate,
  value: number[],
  onChange: (Whitelist[]) => void,
  whitelists: Whitelist[],
};

type Option = {
  value: string,
  data: Whitelist,
  label: string,
};

const OptionComponent = (props: OptionProps) => {
  const { selectProps, data, isSelected } = props;
  const renderDisabled =
    selectProps.renderIfDisabled && selectProps.renderIfDisabled(data.data);

  return (
    <Disabled
      disabled={
        !!renderDisabled || (selectProps.hasReachMaxLength && !isSelected)
      }
    >
      <components.Option {...props}>
        <Box horizontal align="center" flow={10} py={5}>
          <Text>{data.label}</Text>
          {renderDisabled}
        </Box>
      </components.Option>
    </Disabled>
  );
};

const customComponents = {
  Option: OptionComponent,
};

class SelectWhitelist extends PureComponent<Props> {
  handleChange = (data: ?Array<Option>) => {
    const d = !data ? [] : data.map(d => d.data);
    this.props.onChange(d);
  };

  render() {
    const { value, whitelists, t, ...props } = this.props;

    const options = whitelists.map(w => ({
      label: w.name,
      value: `${w.id}`,
      data: w,
    }));

    const resolvedValue = value.map(v =>
      options.find(o => parseInt(o.value, 10) === v),
    );

    return (
      <Select
        inputId="input_crypto"
        placeholder="Select 1 or multiple whitelists"
        components={customComponents}
        defaultOptions
        isMulti
        closeMenuOnSelect={false}
        isClearable
        options={options}
        {...props}
        onChange={this.handleChange}
        value={resolvedValue}
      />
    );
  }
}
export default withTranslation()(SelectWhitelist);
