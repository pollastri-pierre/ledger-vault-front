// @flow

import React, { PureComponent } from "react";
import cx from "classnames";
import { withStyles } from "@material-ui/core/styles";

type Props = {
  children: React$Node,
  classes: { [_: $Keys<typeof styles>]: string },
  className?: string,

  // style modifiers
  small?: boolean,
  large?: boolean
};

const styles = {
  base: {
    fontFamily: "'Open Sans', 'Roboto', 'Helvetica', 'Arial', sans-serif",
    fontSize: 13,
    lineHeight: 1.75
  },
  large: {
    fontSize: 16
  },
  small: {
    fontSize: 11
  }
};

class Text extends PureComponent<Props> {
  render() {
    const { children, classes, small, large, className } = this.props;
    return (
      <div
        className={cx(classes.base, className, [
          small && classes.small,
          large && classes.large
        ])}
      >
        {children}
      </div>
    );
  }
}

export default withStyles(styles)(Text);
