//@flow
import React, { PureComponent } from "react";
import classnames from "classnames";
import { withStyles } from "material-ui/styles";

const styles = {
  common: {
    width: 25
  }
};

type Props = { classes: Object, className?: string, color?: string };
class Lock extends PureComponent<Props> {
  static defaultProps = {
    color: "#cccccc"
  };
  render() {
    const { color, classes, className } = this.props;
    return (
      <svg
        className={classnames(classes.common, className)}
        viewBox="0 0 25.1 32"
      >
        <defs />
        <title>lock</title>
        <g id="Layer_2" data-name="Layer 2">
          <g id="Line">
            <g id="Lock">
              <rect
                x="1"
                y="13.67"
                width="23.1"
                height="17.33"
                fill="none"
                style={{ strokeWidth: 2 }}
                stroke={color}
              />
              <path
                d="M4.95,13.67V8.6a7.6,7.6,0,1,1,15.21,0v5.07"
                fill="none"
                style={{ strokeWidth: 2 }}
                stroke={color}
              />
            </g>
          </g>
        </g>
      </svg>
    );
  }
}

export default withStyles(styles)(Lock);
