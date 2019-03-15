// @flow
import React, { PureComponent } from "react";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  common: {
    height: "9.5px",
    width: "11px",
  },
  black: {
    fill: "black",
  },
};

type Props = { color?: string, classes: { [_: $Keys<typeof styles>]: string } };

class Lines extends PureComponent<Props> {
  static defaultProps = {
    color: "currentColor",
  };

  render() {
    const { color, classes, ...props } = this.props;
    return (
      <svg viewBox="0 0 30 25.78" className={classes.common} {...props}>
        <path
          fill={color}
          d="M0,25.78v-4H30v4Zm0-7.25v-4H23.51v4Zm0-7.25v-4H27.83v4ZM0,4V0H21.34V4Z"
        />
      </svg>
    );
  }
}

export default withStyles(styles)(Lines);
