// @flow
import React, { Component } from "react";
import { MenuItem } from "material-ui/Menu";
import Select from "material-ui/Select";
import type { Speed } from "../../../api/queries/AccountCalculateFeeQuery";

type Fee = {
  key: string,
  title: string
};

class FeePicker extends Component<{
  fees: Array<Fee>,
  value: Speed,
  onChange: Speed => void
}> {
  static defaultProps = {
    fees: [
      {
        key: "slow",
        title: "Slow (1 hour)"
      },
      {
        key: "medium",
        title: "Medium (30 minutes)"
      },
      {
        key: "fast",
        title: "Fast (10 minutes)"
      }
    ]
  };

  renderValue = (key: string) =>
    (this.props.fees.find(f => f.key === key) || {}).title;

  onChange = (e: SyntheticEvent<>) => {
    this.props.onChange(e.target.value);
  };

  render() {
    const { value, fees } = this.props;
    return (
      <Select
        value={value}
        onChange={this.onChange}
        renderValue={this.renderValue}
      >
        {fees.map(fee => (
          <MenuItem disableRipple value={fee.key} key={fee.key}>
            {fee.title}
          </MenuItem>
        ))}
      </Select>
    );
  }
}

export default FeePicker;
