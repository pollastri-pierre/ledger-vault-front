// @flow

import React, { Component } from "react";
import type { CryptoCurrency, Unit } from "@ledgerhq/live-common/lib/types";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";

import { storiesOf } from "@storybook/react";
import { boolean } from "@storybook/addon-knobs";
import { action } from "@storybook/addon-actions";

import UnitSelect from "components/UnitSelect";
import TextField from "components/utils/TextField";

const currency: CryptoCurrency = getCryptoCurrencyById("bitcoin");

const INPUT_LARGE = {
  style: { textAlign: "right", fontSize: 20 }
};

const INPUT_SMALL = {
  style: { textAlign: "right" }
};

storiesOf("Components", module).add("InputCurrency", () => {
  const inputTextSizeLarge: boolean = boolean("inputTextSizeLarge", true);
  const fullWidth: boolean = boolean("fullWidth", true);
  return (
    <Wrapper
      currency={currency}
      size={inputTextSizeLarge}
      fullWidth={fullWidth}
    />
  );
});

class Wrapper extends Component<
  { currency: CryptoCurrency, size: boolean, fullWidth: boolean },
  { value: string, unit: Unit }
> {
  state = {
    value: "5",
    unit: currency.units[0]
  };

  handleChange = (e: SyntheticEvent<HTMLInputElement>) => {
    action("onChange")(e.currentTarget.value);
    this.setState({ value: e.currentTarget.value });
  };

  handleUnitChange = (index: number) => {
    const { currency } = this.props;
    const unit = currency.units[index];
    action("onChange")(unit);
    this.setState({ unit });
  };

  render() {
    const { currency, size, fullWidth } = this.props;
    const { value, unit } = this.state;
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-end"
        }}
      >
        <UnitSelect
          units={currency.units}
          index={currency.units.findIndex(u => u.code === unit.code)}
          onChange={this.handleUnitChange}
          size={size ? "large" : "small"}
        />
        <TextField
          value={value}
          onChange={this.handleChange}
          inputProps={size ? INPUT_LARGE : INPUT_SMALL}
          fullWidth={fullWidth}
        />
      </div>
    );
  }
}
