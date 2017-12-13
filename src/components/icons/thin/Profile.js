//@flow
import React from "react";
import classnames from "classnames";
import injectSheet from "react-jss";

const styles = {
  base: {
    width: "15px"
  },
  common: {
    fill: "none",
    strokeMiterlimit: "10",
    strokeWidth: "2px",
    stroke: "white"
  }
};

function Profile(props: { classes: Object, type: string }) {
  const { classes } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 27.8 32"
      className={classes.base}
    >
      <title>profile</title>
      <g id="Layer_2" data-name="Layer 2">
        <g id="Line">
          <g id="User">
            <path
              d="M13.9,18.1A12.9,12.9,0,0,0,1,31H26.8A12.9,12.9,0,0,0,13.9,18.1Z"
              className={classnames(classes.common)}
            />
            <circle
              cx="13.9"
              cy="9.55"
              r="8.55"
              className={classnames(classes.common)}
            />
          </g>
        </g>
      </g>
    </svg>
  );
}

Profile.defaultProps = {
  color: "#000"
};

export default injectSheet(styles)(Profile);
