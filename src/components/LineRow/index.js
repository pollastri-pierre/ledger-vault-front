//@flow
import React, { Component } from "react";
import { withStyles } from "material-ui/styles";
import colors from "../../shared/colors";

const styles = {
  base: {
    width: "100%",
    height: "42px",
    lineHeight: "41px",
    borderTop: `1px solid ${colors.argile}`
  },
  title: {
    fontWeight: "600",
    fontSize: "11px",
    textTransform: "uppercase"
  },
  value: {
    fontSize: "13px",
    float: "right",
    textAlign: "right"
  }
};
class LineRow extends Component<{
  label: string,
  children: React$Node | string,
  classes: Object
}> {
  render() {
    const { label, children, classes } = this.props;
    return (
      <div className={classes.base}>
        <span className={classes.title}>{label}</span>
        <span className={classes.value}>{children}</span>
      </div>
    );
  }
}

export default withStyles(styles)(LineRow);
