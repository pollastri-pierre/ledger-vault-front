// @flow
import React, { Component } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import cx from "classnames";
import type { Unit } from "data/types";
import BlueSelectRightRenderValue from "../../BlueSelectRightRenderValue";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  select: {
    paddingBottom: 10
  },
  menu: {
    color: "#27d0e2"
  }
};

class UnitSelect extends Component<{
  units: Array<Unit>,
  index: number,
  onChange: number => void,
  classes: { [_: $Keys<typeof styles>]: string }
}> {
  renderValue = (index: number) => {
    return (
      <span style={{ fontSize: 21, lineHeight: "22px" }}>
        {this.props.units[index].code}
      </span>
    );
  };

  onChange = (e: *) => {
    this.props.onChange(Number(e.target.value));
  };

  // <ArrowDown style={{ width: 11 }} />
  render() {
    const { index, units, classes } = this.props;
    return (
      <Select
        value={index}
        onChange={this.onChange}
        renderValue={value => (
          <BlueSelectRightRenderValue>
            {this.renderValue(value)}
          </BlueSelectRightRenderValue>
        )}
        className={cx("MuiSelect-disable-arrow")}
        classes={{ root: classes.select }}
      >
        {units.map((unit, i) => (
          <MenuItem disableRipple value={i} key={i} className={classes.menu}>
            <span style={{ color: "black" }}>{unit.code}</span>
          </MenuItem>
        ))}
      </Select>
    );
  }
}

export default withStyles(styles)(UnitSelect);
