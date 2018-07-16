//@flow
import React from "react";
import classnames from "classnames";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  common: {
    width: "8px"
  },
  up: {
    transform: "rotate(45deg)"
  },
  down: {
    transform: "rotate(135deg)"
  }
};
function Arrow({ classes, type, color }: *) {
  const stroke = color ? color : "#000";
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 30.32 32.83"
      className={classnames(classes.common, classes[type])}
    >
      <title>ArrowUp</title>
      <g id="Layer_2" data-name="Layer 2">
        <g id="Solid">
          <g id="Up">
            <polyline
              style={{
                fill: "none",
                stroke: stroke,
                strokeMiterlimit: "10",
                strokeWidth: "4px"
              }}
              points="28.9 16.57 15.16 2.83 1.41 16.57"
            />
            <line
              style={{
                fill: "none",
                stroke: stroke,
                strokeMiterlimit: "10",
                strokeWidth: "4px"
              }}
              x1="15.16"
              y1="2.83"
              x2="15.16"
              y2="32.83"
            />
          </g>
        </g>
      </g>
    </svg>
  );
}

export default withStyles(styles)(Arrow);
