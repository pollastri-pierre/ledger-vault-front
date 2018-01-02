//@flow
import React, { PureComponent } from "react";
import { withStyles } from "material-ui/styles";
import classnames from "classnames";

type Props = {
  className: string,
  classes: { [_: $Keys<typeof styles>]: string }
};

const styles = {
  default: {
    width: 12,
    fill: "currentColor"
  }
};
class HourglassFull extends PureComponent<Props> {
  render() {
    const { classes, className } = this.props;

    return (
      <svg viewBox="0 0 27.67 30" className={classnames(classes, className)}>
        <path d="M23.52,27.84V24.29c0-2.81-5.59-8.7-5.83-9.29.25-.59,5.83-6.49,5.83-9.3V2.16H4.15V5.71c0,2.81,5.58,8.75,5.81,9.3-.22.55-5.81,6.49-5.81,9.29v3.54ZM21.9,26" />
        <rect width="27.67" height="2.16" />
        <rect y="27.84" width="27.67" height="2.16" />
      </svg>
    );
  }
}

export default withStyles(styles)(HourglassFull);
