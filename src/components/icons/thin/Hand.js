// @flow
import React, { PureComponent } from "react";
import classnames from "classnames";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  common: {
    fill: "none",
    stroke: "#cccccc",
    strokeMiterlimit: 10,
    strokeWidth: 2,
  },
};

type Props = { classes: Object, className?: string };
class Hand extends PureComponent<Props> {
  render() {
    const { classes, className, ...rest } = this.props;
    return (
      <svg {...rest} viewBox="0 0 28.95 32">
        <g id="Layer_2" data-name="Layer 2">
          <g id="Line">
            <path
              className={classnames(classes.common, className)}
              d="M27.62,16.11a.87.87,0,0,0-.4-.58,28.26,28.26,0,0,0-9.84-3.95l-.78-.17L15.7,4a3,3,0,0,0-6.06-.11s0,.06,0,.09V8.34L9.56,19l-1.15-.9a6.33,6.33,0,0,0-3.73-1.45,4.55,4.55,0,0,0-3.45,1.63.85.85,0,0,0-.07,1.08,40,40,0,0,0,5.19,5.74,28.14,28.14,0,0,0,5.53,4A14.72,14.72,0,0,0,18.64,31h.1a8.39,8.39,0,0,0,6.83-2.89c3.52-4.28,2.11-11.69,2.05-12Z"
            />
          </g>
        </g>
      </svg>
    );
  }
}

export default withStyles(styles)(Hand);
