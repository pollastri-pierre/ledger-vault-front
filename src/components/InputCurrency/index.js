//@flow
import React, { PureComponent } from "react";
import { withStyles } from "@material-ui/core/styles";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/helpers/currencies";
import type { CryptoCurrency, Unit } from "@ledgerhq/live-common/lib/types";

import type { Unit as WeakUnit } from "data/types";
import { TextField } from "components";
import UnitSelect from "components/UnitSelect";
import { sanitizeValueString } from "components/Send/helpers";

type Size = "large" | "small";

type Props = {
  currency: CryptoCurrency,
  size?: Size,
  onChange: number => void,
  value: number,
  defaultUnit: WeakUnit,
  placeholder?: string,

  classes: { [_: $Keys<typeof styles>]: string }
};

type State = {
  displayValue: string,
  unit: Unit,

  // used to refresh display value if value change from the outside
  cachedValue: number
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    width: "100%"
  }
};

const INPUT_LARGE = {
  style: { textAlign: "right", fontSize: 22 }
};

const INPUT_SMALL = {
  style: { textAlign: "right" }
};

class InputCurrency extends PureComponent<Props, State> {
  static defaultProps = {
    size: "small"
  };

  static getDerivedStateFromProps(props, state) {
    if (props.value !== state.cachedValue) {
      const val = formatCurrencyUnit(state.unit, props.value);
      return {
        displayValue: parseFloat(val) > 0 ? val : "",
        cachedValue: props.value
      };
    }
    return null;
  }

  constructor(props: Props) {
    super(props);
    const { defaultUnit, value } = props;
    const val = formatCurrencyUnit(defaultUnit, value);
    this.state = {
      unit: this.props.defaultUnit,
      displayValue: parseFloat(val) > 0 ? val : "",
      cachedValue: value
    };
  }

  onChangeUnit = (index: number) => {
    const { currency } = this.props;
    const unit = currency.units[index];
    this.setState({
      displayValue: formatCurrencyUnit(unit, this.props.value),
      unit
    });
  };

  onChange = (e: SyntheticEvent<HTMLInputElement>) => {
    const { unit } = this.state;
    const r = sanitizeValueString(unit, e.currentTarget.value);
    const satoshiValue = parseInt(r.value);
    this.props.onChange(satoshiValue);
    this.setState({ displayValue: r.display, cachedValue: satoshiValue });
  };

  render() {
    const {
      currency,
      classes,
      onChange: _onChange,
      size,
      value: _value,
      defaultUnit: _defaultUnit,
      ...props
    } = this.props;
    const { displayValue, unit } = this.state;
    return (
      <div className={classes.container}>
        <UnitSelect
          units={currency.units}
          index={currency.units.findIndex(u => u.code === unit.code)}
          onChange={this.onChangeUnit}
          size={size}
        />
        <TextField
          fullWidth
          inputProps={size === "large" ? INPUT_LARGE : INPUT_SMALL}
          value={displayValue}
          onChange={this.onChange}
          {...props}
        />
      </div>
    );
  }
}

export default withStyles(styles)(InputCurrency);
