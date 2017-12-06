//@flow
import React from "react";
import Popover from "material-ui/Popover";
import { withStyles } from "material-ui/styles";
import "./PopBubble.css";

const styles = {
  paper: {
    marginTop: "20px",
    padding: "20px",
    overflow: "inherit",
    boxShadow:
      "0 0 5px 0 rgba(0, 0, 0, 0.04), 0 10px 10px 0 rgba(0, 0, 0, 0.04)"
  }
};

function PopBubble(props: {
  className?: string,
  style?: Object,
  children?: React$Node
}) {
  let triangle = {
    position: "absolute",
    top: "-12px",
    background: "white",
    right: "20px",
    width: "0",
    height: "0",
    border: "12px solid black",
    borderColor: "transparent transparent #ffffff #ffffff",
    transform: "rotate(-45deg)",
    boxShadow: "2px -3px 10px 0 rgba(0, 0, 0, 0.04)"
  };
  const horizontal = props.direction ? props.direction : "right";

  if (horizontal === "left") {
    (triangle.right = "auto"), (triangle.left = "20px");
  }

  return (
    <Popover
      {...props}
      className={`pop-bubble ${props.className || ""}`}
      anchorOrigin={{ horizontal: horizontal, vertical: "bottom" }}
      transformOrigin={{ horizontal: horizontal }}
      classes={{ paper: props.classes.paper }}
    >
      <div style={triangle} />
      {props.children}
    </Popover>
  );
}

PopBubble.defaultProps = {
  children: "",
  style: {},
  className: ""
};

export default withStyles(styles)(PopBubble);
