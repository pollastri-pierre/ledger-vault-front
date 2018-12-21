//@flow
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import colors from "shared/colors";

const styles = {
  base: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    height: "42px",
    lineHeight: "41px",
    borderTop: `1px solid ${colors.cream}`
  },
  title: {
    fontWeight: 600,
    fontSize: 11,
    textTransform: "uppercase"
  },
  value: {
    fontSize: 13,
    flexBasis: "50%",
    overflow: "hidden",
    textOverflow: "ellipsis",
    textAlign: "end"
  }
};
class LineRow extends Component<{
  label: React$Node,
  children: React$Node | string,
  classes: { [_: $Keys<typeof styles>]: string }
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
