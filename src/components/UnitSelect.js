// @flow
import React, { Component } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import { withStyles } from "@material-ui/core/styles";
import Select from "@material-ui/core/Select";

import cx from "classnames";
import type { Unit } from "data/types";
import BlueSelectRightRenderValue from "components/BlueSelectRightRenderValue";
import colors from "shared/colors";

const styles = {
  select: {
    paddingBottom: 10,
  },
  menu: {
    color: colors.ocean,
  },
  selectLarge: {
    fontSize: 20,
    lineHeight: "22px",
  },
};

class UnitSelect extends Component<{
  units: Array<Unit>,
  index: number,
  onChange: number => void,
  size?: string,
  classes: { [_: $Keys<typeof styles>]: string },
}> {
  renderValue = (index: number) => {
    const { size, classes } = this.props;
    return (
      <span className={size && size === "large" ? classes.selectLarge : null}>
        {this.props.units[index].code}
      </span>
    );
  };

  onChange = (e: SyntheticInputEvent<*>) => {
    this.props.onChange(Number(e.target.value));
  };

  render() {
    const { index, units, classes, size } = this.props;
    return (
      <Select
        value={index}
        data-test="unit-select"
        onChange={this.onChange}
        renderValue={value => (
          <BlueSelectRightRenderValue size={size}>
            {this.renderValue(value)}
          </BlueSelectRightRenderValue>
        )}
        className={cx("MuiSelect-disable-arrow")}
        classes={{ root: classes.select }}
      >
        {units.map((unit, i) => (
          <MenuItem
            disableRipple
            value={i}
            key={i} // eslint-disable-line react/no-array-index-key
            className={classes.menu}
            data-test="unit-select-values"
          >
            <span style={{ color: colors.black }}>{unit.code}</span>
          </MenuItem>
        ))}
      </Select>
    );
  }
}

export default withStyles(styles)(UnitSelect);
