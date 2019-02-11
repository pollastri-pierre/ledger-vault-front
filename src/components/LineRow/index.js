// @flow
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import colors from "shared/colors";
import InfoCircle from "components/icons/InfoCircle";

const styles = {
  base: {
    display: "flex",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    height: "42px",
    lineHeight: "41px",
    borderTop: `1px solid ${colors.cream}`
  },
  titleContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
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
  },
  warningIcon: {
    marginLeft: 5
  }
};
class LineRow extends Component<{
  label: React$Node,
  children: React$Node | string,
  classes: { [_: $Keys<typeof styles>]: string },
  tooltipInfoMessage?: React$Node
}> {
  render() {
    const { label, children, classes, tooltipInfoMessage } = this.props;
    return (
      <div className={classes.base}>
        <div className={classes.titleContainer}>
          <span className={classes.title}>{label}</span>
          {tooltipInfoMessage && (
            <Tooltip title={tooltipInfoMessage} placement="right">
              <div className={classes.warningIcon}>
                <InfoCircle size={10} color={colors.lead} />
              </div>
            </Tooltip>
          )}
        </div>
        <span className={classes.value}>{children}</span>
      </div>
    );
  }
}

export default withStyles(styles)(LineRow);
