//@flow
import React, { PureComponent } from "react";
import classnames from "classnames";
import colors from "../../shared/colors";
import { withStyles } from "material-ui/styles";

const styles = {
  base: {
    display: "inline-block",
    textAlign: "center",
    verticalAlign: "middle",
    width: "115px"
  },
  title: {
    display: "block",
    fontSize: "13px",
    color: "black",
    marginBottom: "5px"
  },
  value: {
    display: "block",
    fontSize: "11px",
    color: colors.lead
  },
  icon: {
    marginBottom: "10px"
  },
  disabled: {
    opacity: "0.5"
  }
};
class BadgeSecurity extends PureComponent<{
  icon: string | React$Node,
  label: string,
  value: string | React$Node,
  disabled?: boolean,
  classes: Object
}> {
  render() {
    const { icon, label, value, disabled, classes } = this.props;

    return (
      <div
        className={classnames(classes.base, { [classes.disabled]: disabled })}
      >
        <div className={classes.icon}>{icon}</div>
        <span className={classes.title}>{label}</span>
        {disabled ? (
          <span className={classes.value}>disabled</span>
        ) : (
          <span className={classes.value}>{value}</span>
        )}
      </div>
    );
  }
}

export default withStyles(styles)(BadgeSecurity);
