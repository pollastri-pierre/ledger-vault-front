// @flow
import classnames from "classnames";
import React, { PureComponent } from "react";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  common: {
    width: 13,
  },
};

type Props = {
  className: string,
  classes: { [_: $Keys<typeof styles>]: string },
};

class RatesFull extends PureComponent<Props> {
  render() {
    const { classes, className } = this.props;
    return (
      <svg
        viewBox="0 0 30 28.57"
        className={classnames(classes.common, className)}
      >
        <g id="Layer_2" data-name="Layer 2">
          <g id="Solid">
            <g id="Rate_copy" data-name="Rate copy">
              <rect width="4.76" height="28.57" />
              <rect x="8.41" y="11.43" width="4.76" height="17.14" />
              <rect x="16.83" y="5.71" width="4.76" height="22.86" />
              <rect x="25.24" y="17.14" width="4.76" height="11.43" />
            </g>
          </g>
        </g>
      </svg>
    );
  }
}

export default withStyles(styles)(RatesFull);
