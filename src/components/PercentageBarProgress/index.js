//@flow
import React, { PureComponent } from "react";
import { withStyles } from "material-ui/styles";
import colors from "shared/colors";

const styles = {
  base: {
    textAlign: "center",
    margin: "auto",
    marginBottom: "50px",
    width: "270px",
    "& p": {
      fontSize: "11px",
      fontWeight: "600",
      textTransform: "uppecarse",
      marginBottom: "20px",
      "& p span": {
        fontSize: "10px",
        color: colors.lead,
        fontWeight: "600",
        display: "inline-block",
        marginLeft: "10px"
      }
    }
  },
  percentageBar: {
    height: "2px",
    background: colors.mouse,
    position: "relative"
  },
  fill: {
    height: "2px",
    position: "absolute",
    top: "0",
    left: "0",
    background: colors.ocean
  }
};

class PercentageBarProgress extends PureComponent<{
  percentage: number,
  label: string | React$Node,
  classes: Object
}> {
  render() {
    const { percentage, label, classes } = this.props;

    return (
      <div className={classes.base}>
        {label}
        <div className={classes.percentageBar}>
          <div
            className={classes.fill}
            style={{ width: `${100 * percentage}%` }}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(PercentageBarProgress);
