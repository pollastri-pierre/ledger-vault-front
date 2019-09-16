// @flow
import React, { PureComponent, createRef } from "react";
import { BigNumber } from "bignumber.js";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/currencies";
import type { CryptoCurrency, Unit } from "@ledgerhq/live-common/lib/types";

import colors from "shared/colors";
import Box from "components/base/Box";
import Text from "components/base/Text";
import CounterValue from "components/CounterValue";
import Select from "components/base/Select";
import { InputText } from "components/base/form";
import { sanitizeValueString } from "utils/strings";
import type { Option } from "components/base/Select";

type Props = {
  currency: CryptoCurrency,
  onChange: BigNumber => void,
  value: BigNumber,
  hideUnit?: boolean,
  hideCV?: boolean,
  unit?: Unit,
  width?: number,
};

type State = {
  displayValue: string,
  unit: Unit,
  options: Option[],

  // used to refresh display value if value change from the outside
  cachedValue: BigNumber,
};

class InputAmount extends PureComponent<Props, State> {
  static getDerivedStateFromProps(props: Props, state: State) {
    if (!props.value.isEqualTo(state.cachedValue)) {
      const val = formatCurrencyUnit(state.unit, props.value);
      return {
        displayValue: props.value.isEqualTo(0) ? "" : val,
        cachedValue: props.value,
      };
    }
    return null;
  }

  inputRef: * = createRef();

  constructor(props: Props) {
    super(props);
    const { value, currency, unit: propUnit } = props;
    const unit = propUnit || currency.units[0];
    const val = formatCurrencyUnit(unit, value);
    this.state = {
      unit,
      options: currency.units.map(u => ({
        label: u.code,
        value: u.code,
        data: u,
      })),
      displayValue: value.isEqualTo(0) ? "" : val,
      cachedValue: value,
    };
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevState.unit !== this.state.unit) {
      this.inputRef.current && this.inputRef.current.focus();
    }
  }

  onChangeUnit = (opt: ?Option) => {
    if (!opt) return;
    const { value } = this.props;
    const { data: unit } = opt;
    this.setState({
      displayValue: value.isEqualTo(0) ? "" : formatCurrencyUnit(unit, value),
      unit,
    });
  };

  onChange = (str: string) => {
    const { unit } = this.state;
    const r = sanitizeValueString(unit, str);
    const satoshiValue = BigNumber(r.value);
    this.props.onChange(satoshiValue);
    this.setState({ displayValue: r.display, cachedValue: satoshiValue });
  };

  onFocus = () => {
    const { value } = this.props;
    if (value.isEqualTo(0)) return;
    const { unit } = this.state;
    this.setState({
      displayValue: formatCurrencyUnit(unit, value, { useGrouping: false }),
    });
  };

  onBlur = () => {
    const { value } = this.props;
    if (value.isEqualTo(0)) return;
    const { unit } = this.state;
    this.setState({
      displayValue: formatCurrencyUnit(unit, value),
    });
  };

  render() {
    const { value, currency, hideUnit, hideCV, width, ...props } = this.props;
    const { displayValue, unit, options } = this.state;
    const option = options.find(opt => opt.data === unit);
    return (
      <Box horizontal flow={10} width={width || 370}>
        <Box grow>
          <InputText
            placeholder="0"
            align="right"
            grow
            data-test="input_amount"
            value={displayValue}
            inputRef={this.inputRef}
            {...props}
            onChange={this.onChange}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
          />
          {!hideCV && (
            <Box alignSelf="flex-end">
              <Text color={colors.textLight} small>
                <CounterValue value={value} from={currency.id} />
              </Text>
            </Box>
          )}
        </Box>
        {!hideUnit && (
          <Box width={120}>
            <Select
              tabIndex={-1}
              value={option}
              options={options}
              onChange={this.onChangeUnit}
            />
          </Box>
        )}
      </Box>
    );
  }
}

export default InputAmount;
