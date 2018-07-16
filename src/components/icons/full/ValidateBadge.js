//@flow
import React, { PureComponent } from "react";
import { withStyles } from "@material-ui/core/styles";
import classnames from "classnames";

type Props = { color: string, className?: string, classes: Object };

const styles = {
  common: {
    width: 13,
    fill: "currentColor"
  }
};
class ValidateBadge extends PureComponent<Props> {
  render() {
    const { classes, className } = this.props;

    return (
      <svg
        viewBox="0 0 30 30"
        className={classnames(classes.common, className)}
      >
        <path d="M15,0A15,15,0,1,0,30,15,15,15,0,0,0,15,0ZM12.95,22.32,5.87,15.46l2.51-2.58,4.57,4.43,8.68-8.41,2.51,2.58Z" />
      </svg>
    );
  }
}

export default withStyles(styles)(ValidateBadge);
