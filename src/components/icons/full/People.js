//@flow
import classnames from "classnames";
import React, { PureComponent } from "react";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  common: {
    width: 13
  }
};

type Props = {
  className: string,
  classes: { [_: $Keys<typeof styles>]: string }
};

class PeopleFull extends PureComponent<Props> {
  render() {
    const { classes, className } = this.props;
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 29.18 24.28"
        className={classnames(classes.common, className)}
      >
        <g id="Layer_2" data-name="Layer 2">
          <g id="Mode_Isolation" data-name="Mode Isolation">
            <circle cx="10.43" cy="7.19" r="7.19" />
            <path d="M10.85,13.43A10.85,10.85,0,0,0,0,24.28H21.69A10.85,10.85,0,0,0,10.85,13.43Z" />
            <path d="M20.43,13.4a8.42,8.42,0,0,0-1.92.23,12.87,12.87,0,0,1,6,8.89h4.64A8.94,8.94,0,0,0,20.43,13.4Z" />
            <path d="M20.87,3.32a5.71,5.71,0,0,0-1.12.11A8.42,8.42,0,0,1,18,13.35a8.68,8.68,0,0,1,2,1.29,5.69,5.69,0,1,0,.9-11.31Z" />
          </g>
        </g>
      </svg>
    );
  }
}

export default withStyles(styles)(PeopleFull);
