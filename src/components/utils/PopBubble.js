//@flow
import React from "react";
import Popover from "material-ui/Popover";

import "./PopBubble.css";

function PopBubble(props: *) {
  return (
    <Popover
      {...props}
      className={`pop-bubble ${props.className}`}
      anchorOrigin={{ horizontal: "middle", vertical: "bottom" }}
      targetOrigin={{ horizontal: "middle", vertical: "top" }}
      style={{
        marginTop: "15px",
        borderRadius: 0,
        boxShadow:
          "0 0 5px 0 rgba(0, 0, 0, 0.04), 0 10px 10px 0 rgba(0, 0, 0, 0.04)",
        ...props.style
      }}
    >
      {props.children}
    </Popover>
  );
}

PopBubble.defaultProps = {
  children: "",
  style: {},
  className: ""
};

export default PopBubble;
