//@flow
import React, { PureComponent } from "react";
import { withStyles } from "@material-ui/core/styles";
import colors from "shared/colors";
import classnames from "classnames";

const styles = {
  base: {
    borderBottom: `1px solid ${colors.argile}`,
    position: "relative",
    paddingLeft: "50px",
    "&:last-child": {
      border: "0"
    },
    "&:first-child": {
      marginTop: "40px"
    }
  },
  unactive: {
    opacity: "0.5"
  },
  name: {
    display: "block",
    margin: "0",
    fontSize: "13px",
    color: "black",
    lineHeight: "1.77",
    marginTop: "15px"
  },
  value: {
    display: "block",
    margin: "0",
    fontSize: "11px",
    lineHeight: "2.09",
    color: colors.steel,
    marginBottom: "15px"
  },
  state: {
    fontSize: "13px",
    color: colors.steel,
    lineHeight: "1.77",
    position: "absolute",
    right: "0",
    top: "10%"
  },
  icon: {
    position: "absolute",
    left: "0",
    top: "10px"
  }
};
class ApproveLockRow extends PureComponent<{
  icon: string | React$Node,
  name: string | React$Node,
  value: string | React$Node,
  unactive?: boolean,
  state?: string | React$Node,
  classes: Object
}> {
  render() {
    const { icon, name, value, state, unactive, classes } = this.props;

    const currentState = unactive ? "unactive" : state;

    return (
      <div
        className={classnames(classes.base, { [classes.unactive]: unactive })}
      >
        <div className={classes.icon}>{icon}</div>
        <span className={classes.name}>{name}</span>
        <span className={classes.value}>{value}</span>
        <span className={classes.state}>{currentState}</span>
      </div>
    );
  }
}

export default withStyles(styles)(ApproveLockRow);
