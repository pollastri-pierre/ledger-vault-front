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
class Box extends PureComponent<Props> {
  static defaultProps = {
    color: "#cccccc"
  };
  render() {
    const { classes, className, ...rest } = this.props;
    return (
      <svg viewBox="0 0 32 28.3" {...rest}>
        <g id="Layer_2_1_">
          <g id="Line">
            <g id="Box">
              <rect
                x="1"
                y="1.1"
                width="30"
                height="26.2"
                className={classnames(classes.common, className)}
              />
              <g id="Box-2">
                <polygon
                  className={classnames(classes.common, className)}
                  points="27,11.8 5,11.8 2,1.1 30,1.1 "
                />
              </g>
            </g>
          </g>
        </g>
      </svg>
    );
  }
}

export default withStyles(styles)(Box);
