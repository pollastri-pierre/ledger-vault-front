//@flow
import React from "react";
import classnames from "classnames";
import colors from "../../../shared/colors";
import { withStyles } from "material-ui/styles";

const styles = {
  base: {
    width: "15px"
  },
  security: {
    width: "26px",
    height: "30px"
  },
  common: {
    fill: "none",
    strokeMiterlimit: "10",
    strokeWidth: "2px",
    stroke: "white"
  },
  grey: {
    stroke: colors.mouse
  }
};

function Profile(props: { classes: Object, type: string }) {
  const { classes, grey, security } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 27.8 32"
      className={classes.base}
      className={classnames(classes.base, { [classes.security]: security })}
    >
      <title>profile</title>
      <g id="Layer_2" data-name="Layer 2">
        <g id="Line">
          <g id="User">
            <path
              d="M13.9,18.1A12.9,12.9,0,0,0,1,31H26.8A12.9,12.9,0,0,0,13.9,18.1Z"
              className={classnames(classes.common, { [classes.grey]: grey })}
            />
            <circle
              cx="13.9"
              cy="9.55"
              r="8.55"
              className={classnames(classes.common, { [classes.grey]: grey })}
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

export default withStyles(styles)(Profile);
