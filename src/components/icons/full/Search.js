// @flow
import classnames from "classnames";
import React, { PureComponent } from "react";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  common: {
    height: "11px",
    width: "8.5px"
  }
};

type Props = {
  color?: string,
  className: string,
  classes: { [_: $Keys<typeof styles>]: string }
};

class Search extends PureComponent<Props> {
  static defaultProps = {
    color: "currentColor"
  };

  render() {
    const { color, classes, className } = this.props;
    return (
      <svg
        viewBox="0 0 22.98 30"
        className={classnames(classes.common, className)}
      >
        <path
          fill={color}
          d="M14.38,20.88a10.65,10.65,0,0,1-3.62.63,10.79,10.79,0,0,1-9.32-5.38A10.76,10.76,0,0,1,10.75,0a10.79,10.79,0,0,1,9.32,5.38A10.75,10.75,0,0,1,17.71,19L23,28.08,19.65,30Zm-3.63-17a6.91,6.91,0,1,0,6,3.45A6.9,6.9,0,0,0,10.75,3.85Z"
        />
      </svg>
    );
  }
}

export default withStyles(styles)(Search);
