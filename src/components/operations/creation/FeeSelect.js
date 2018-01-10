// @flow
import React, { Component } from "react";
import { MenuItem } from "material-ui/Menu";
import cx from "classnames";
import Select from "material-ui/Select";
import { speeds } from "api/queries/AccountCalculateFeeQuery";
import type { Speed } from "api/queries/AccountCalculateFeeQuery";
import BlueSelectRightRenderValue from "../../BlueSelectRightRenderValue";
import { withStyles } from "material-ui/styles";

type Fee = {
  key: string,
  title: string,
};

const styles = {
  select: {
    paddingBottom: 13,
  },
  menu: {
    color: "#27d0e2",
  },
};

class FeePicker extends Component<{
  fees: Array<Fee>,
  value: Speed,
  onChange: Speed => void,
  classes: { [_: $Keys<typeof styles>]: string },
}> {
  static defaultProps = {
    fees: [
      {
        key: "slow",
        title: "Slow (1 hour)",
      },
      {
        key: "medium",
        title: "Medium (30 minutes)",
      },
      {
        key: "fast",
        title: "Fast (10 minutes)",
      },
    ],
  };

  renderValue = (key: string) => (this.props.fees.find(f => f.key === key) || {}).title;

  onChange = (e: SyntheticEvent<>) => {
    const { target } = e;
    if (target instanceof HTMLInputElement) {
      const { value } = target;
      if (value in speeds) {
        this.props.onChange(value);
      }
    }
  };

  render() {
    const { value, fees, classes } = this.props;
    return (
      <Select
        value={value}
        onChange={this.onChange}
        className={cx("MuiSelect-disable-arrow")}
        classes={{ root: classes.select }}
        renderValue={value => (
          <BlueSelectRightRenderValue>{this.renderValue(value)}</BlueSelectRightRenderValue>
        )}
      >
        {fees.map(fee => (
          <MenuItem disableRipple value={fee.key} key={fee.key} className={classes.menu}>
            <span style={{ color: "black" }}>{fee.title}</span>
          </MenuItem>
        ))}
      </Select>
    );
  }
}

export default withStyles(styles)(FeePicker);
