//@flow
import React, { PureComponent } from "react";
import classnames from "classnames";
import { withStyles } from "material-ui/styles";

const styles = {
  common: {
    fill: "none",
    stroke: "#cccccc",
    strokeMiterlimit: 10,
    strokeWidth: 2
  }
};

type Props = { classes: Object, className?: string };
class RecoverySheet extends PureComponent<Props> {
  static defaultProps = {
    color: "#cccccc"
  };
  render() {
    const { classes, className, ...rest } = this.props;
    return (
      <svg {...rest} viewBox="0 0 22 32">
        <g id="Layer_2" data-name="Layer 2">
          <g id="Line">
            <g id="Recovery_sheet" data-name="Recovery sheet">
              <line
                className={classnames(classes.common, className)}
                x1="4.45"
                y1="7.67"
                x2="17.55"
                y2="7.67"
              />
              <line
                className={classnames(classes.common, className)}
                x1="4.45"
                y1="12"
                x2="14.45"
                y2="12"
              />
              <line
                className={classnames(classes.common, className)}
                x1="4.45"
                y1="16.33"
                x2="14.45"
                y2="16.33"
              />
              <rect
                className={classnames(classes.common, className)}
                x="1"
                y="1"
                width="20"
                height="30"
              />
            </g>
          </g>
        </g>
      </svg>
    );
  }
}

export default withStyles(styles)(RecoverySheet);
