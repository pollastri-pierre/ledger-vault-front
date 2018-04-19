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

type Props = { classes: Object, className?: string, color?: string };
class Briefcase extends PureComponent<Props> {
  static defaultProps = {
    color: "#cccccc"
  };
  render() {
    const { classes, className, ...rest } = this.props;
    return (
      <svg viewBox="0 0 32 29.82" {...rest}>
        <g id="Layer_2" data-name="Layer 2">
          <g id="Line">
            <g id="Briefcase">
              <rect
                className={classnames(classes.common, className)}
                x="1"
                y="5.14"
                width="30"
                height="23.68"
              />
              <rect
                className={classnames(classes.common, className)}
                x="12.41"
                y="1"
                width="7.18"
                height="4.14"
              />
            </g>
          </g>
        </g>
      </svg>
    );
  }
}

export default withStyles(styles)(Briefcase);
