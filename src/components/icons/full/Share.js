//@flow
import React from "react";
import classnames from "classnames";
import injectSheet from "react-jss";

const styles = {
  common: {
    height: "13px",
    width: "16px"
  },
  white: {
    fill: "white"
  }
};
function Share({ classes, type }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 30 23.63"
      className={classnames(classes.common, classes[type])}
    >
      <title>share_1</title>
      <g id="Layer_2" data-name="Layer 2">
        <g id="Solid">
          <path
            id="Share"
            d="M30,10.58,17.3,0V6.33A17.3,17.3,0,0,0,0,23.63a17.3,17.3,0,0,1,17.3-8.85v6.37Z"
          />
        </g>
      </g>
    </svg>
  );
}

export default injectSheet(styles)(Share);
