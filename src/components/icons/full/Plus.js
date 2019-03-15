// @flow
import React, { PureComponent } from "react";
import classnames from "classnames";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  common: {
    width: 16,
  },
};

type Props = {
  color?: string,
  classes: { [_: $Keys<typeof styles>]: string },
  className: string,
};

class Plus extends PureComponent<Props> {
  static defaultProps = {
    color: "currentColor",
  };

  render() {
    const { color, className, classes } = this.props;
    return (
      <svg
        viewBox="0 0 30 30"
        className={classnames(classes.common, className)}
      >
        <polygon
          fill={color}
          stroke="none"
          points="12.6 30 12.6 17.4 0 17.4 0 12.6 12.6 12.6 12.6 0 17.4 0 17.4 12.6 30 12.6 30 17.4 17.4 17.4 17.4 30 12.6 30"
        />
      </svg>
    );
  }
}
export default withStyles(styles)(Plus);
