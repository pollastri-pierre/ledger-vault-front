//@flow
import React, { PureComponent } from "react";
import { withStyles } from "material-ui/styles";
import classnames from "classnames";

const styles = {
  common: {
    height: "13px",
    width: "16px"
  }
};

type Props = {
  color: string,
  className: string,
  classes: { [_: $Keys<typeof styles>]: string }
};

class Share extends PureComponent<Props> {
  static defaultProps = {
    color: "currentColor"
  };

  render() {
    const { color, classes, className } = this.props;
    return (
      <svg
        viewBox="0 0 30 23.63"
        className={classnames(classes.common, className)}
      >
        <path
          fill={color}
          d="M30,10.58,17.3,0V6.33A17.3,17.3,0,0,0,0,23.63a17.3,17.3,0,0,1,17.3-8.85v6.37Z"
        />
      </svg>
    );
  }
}
export default withStyles(styles)(Share);
