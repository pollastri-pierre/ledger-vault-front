//@flow
import React from "react";
import Popover from "material-ui/Popover";

import "./PopBubble.css";

function PopBubble(props: *) {
  return (
    <Popover
      {...props}
      className="pop-bubble"
      anchorOrigin={{ horizontal: "middle", vertical: "bottom" }}
      targetOrigin={{ horizontal: "middle", vertical: "top" }}
      style={{
        marginTop: "15px",
        borderRadius: 0,
        ...props.style
      }}
    >
      {props.children}
    </Popover>
  );
}

PopBubble.defaultProps = {
  children: "",
  style: {}
};

export default PopBubble;
