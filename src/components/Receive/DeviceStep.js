// @flow
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Circle from "components/Circle";
import colors from "shared/colors";

const styles = {
  container: {
    display: "flex",
    flexDirection: "row",
    margin: 15,
  },
  step_number: {
    fontSize: 11,
    alignSelf: "center",
  },
  step_desc: {
    fontSize: 13,
    color: colors.shark,
    marginLeft: 10,
  },
  step_circle: {
    paddingLeft: 10,
    justifyContent: "center",
    display: "flex",
  },
};

type Props = {
  desc: React$Node,
  stepNumber: number,
  classes: { [_: $Keys<typeof styles>]: string },
};
class DeviceStep extends Component<Props> {
  render() {
    const { desc, classes, stepNumber } = this.props;
    return (
      <div className={classes.container}>
        <div className={classes.step_circle}>
          <Circle size="20px" bg={colors.translucentOcean}>
            <span className={classes.step_number}>{stepNumber}</span>
          </Circle>
        </div>

        <span className={classes.step_desc}>{desc}</span>
      </div>
    );
  }
}

export default withStyles(styles)(DeviceStep);
