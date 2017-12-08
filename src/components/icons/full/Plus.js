//@flow
import React from "react";
import injectSheet from "react-jss";

const styles = {
  header: {
    width: "16px",
    height: "16px"
  },
  menu: {
    width: "11px",
    height: "11px"
  }
};
function Plus({ classes, type }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 30 30"
      className={classes[type]}
    >
      <title>plus_1</title>
      <g id="Layer_2" data-name="Layer 2">
        <g id="Solid">
          <polygon
            id="Plus"
            points="12.6 30 12.6 17.4 0 17.4 0 12.6 12.6 12.6 12.6 0 17.4 0 17.4 12.6 30 12.6 30 17.4 17.4 17.4 17.4 30 12.6 30"
          />
        </g>
      </g>
    </svg>
  );
}

export default injectSheet(styles)(Plus);
