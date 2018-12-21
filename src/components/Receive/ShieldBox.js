//@flow
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import IconShield from "components/icons/Shield";

const styles = {
  shieldContainer: {
    display: "flex",
    flexDirection: "row",
    margin: "0 20px"
  },
  shieldText: {
    fontSize: 11,
    textAlign: "left"
  },
  shieldIcon: {
    marginRight: 10,
    alignSelf: "center"
  }
};

type Props = {
  iconColor: string,
  text: React$Node,
  classes: { [_: $Keys<typeof styles>]: string }
};
class ShieldBox extends Component<Props> {
  render() {
    const { iconColor, classes, text } = this.props;
    return (
      <div className={classes.shieldContainer}>
        <div className={classes.shieldIcon}>
          <IconShield height={32} width={28} color={iconColor} />
        </div>
        <div className={classes.shieldText}>{text}</div>
      </div>
    );
  }
}

export default withStyles(styles)(ShieldBox);
