//@flow
import React, { PureComponent } from "react";
import Arrow from "../icons/ArrowUp";
import colors from "../../shared/colors";
import { withStyles } from "material-ui/styles";

const style = {
  base: {
    fontSize: "22px",
    color: colors.lead,
    "& svg": {
      marginLeft: "5px"
    }
  }
};

const arrowIncr = <Arrow type="up" color={colors.ocean} />;
const arrowDecr = <Arrow type="down" color={colors.ocean} />;

// render a delta percentage (e.g. +2.89%) from a before and after value
class DeltaChange extends PureComponent<*> {
  props: {
    before: number,
    after: number,
    showArrow?: boolean,
    classes: Object
  };
  render() {
    const { before, after, showArrow, classes } = this.props;
    if (!before || !after) return <span className={classes.base}>{" "}</span>;
    const ratio = after / before;
    return (
      <span className={classes.base}>
        {ratio >= 1
          ? "+" + Math.round(10000 * (ratio - 1)) / 100 + "%"
          : "-" + Math.round(10000 * (1 - ratio)) / 100 + "%"}
        {showArrow && ratio !== 0 ? (ratio > 0 ? arrowIncr : arrowDecr) : null}
      </span>
    );
  }
}

export default withStyles(style)(DeltaChange);
