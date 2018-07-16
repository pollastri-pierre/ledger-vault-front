//@flow
import React from "react";
import People from "../icons/thin/Profile";
import classnames from "classnames";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  base: {
    display: "inline-block",
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    background: "#e2e2e2",
    position: "relative",
    "& img": {
      width: "30px",
      height: "30px",
      borderRadius: "50%",
      position: "absolute",
      top: "0px",
      left: "0px;"
    },
    "& svg": {
      position: "absolute",
      top: "50%",
      left: "50%",
      marginLeft: "-7px",
      marginTop: "-8px;"
    }
  }
};

function Avatar(props: {
  url: ?string,
  width: number,
  height: number,
  className: ?string,
  classes: Object
}) {
  const { url, width, height, classes, className } = props;
  return (
    <span className={classnames(classes.base, className)}>
      {url ? (
        <img src={props.url} alt="Profile avatar" />
      ) : (
        <People width={width + "px"} height={height + "px"} color="white" />
      )}
    </span>
  );
}

Avatar.defaultProps = {
  url: "",
  width: 14,
  height: 16
};

export default withStyles(styles)(Avatar);
