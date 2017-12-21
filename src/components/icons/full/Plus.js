//@flow
import React, { PureComponent } from "react";
import classnames from "classnames";
import { withStyles } from "material-ui/styles";

const styles = {
  header: {
    width: "16px",
    height: "16px",
    fill: "white"
  },
  menu: {
    width: "11px",
    height: "11px"
  }
};

type Props = { color: string };

class Plus extends PureComponent<Props> {
  static defaultProps = {
    color: "currentColor"
  };
  render() {
    const { color, type, classes, ...props } = this.props;
    return (
      <svg
        viewBox="0 0 30 30"
        className={classnames(classes.common, classes[type])}
        {...props}
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
