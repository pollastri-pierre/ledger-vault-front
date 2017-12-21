//@flow
import React from "react";
import classnames from "classnames";
import { withStyles } from "material-ui/styles";

const styles = {
  common: {
    width: "11px",
    height: "7px"
  }
};

function ArrowDown({ classes, className }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 30 18.25"
      className={classnames(classes.common, className)}
    >
      <title>dropdown</title>
      <g id="Layer_2" data-name="Layer 2">
        <g id="Solid">
          <polygon
            id="Dropdown"
            points="0 3.25 3.26 0 15 11.75 26.75 0 30 3.25 15 18.25 0 3.25"
          />
        </g>
      </g>
    </svg>
  );
}

export default withStyles(styles)(ArrowDown);
