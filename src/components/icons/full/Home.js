//@flow
import React from "react";
import classnames from "classnames";
import injectSheet from "react-jss";

const styles = {
  common: {
    height: "11px",
    width: "9px"
  },
  black: {
    fill: "black"
  }
};

function Home({ classes, type }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 30 25.31"
      className={classnames(classes.common, classes[type])}
    >
      <title>home</title>
      <g id="Layer_2" data-name="Layer 2">
        <g id="Solid">
          <path
            id="House"
            d="M15,0,0,15.94H3.75v9.37h8V16.85h6.58v8.46h8V15.94H30Z"
          />
        </g>
      </g>
    </svg>
  );
}

export default injectSheet(styles)(Home);
