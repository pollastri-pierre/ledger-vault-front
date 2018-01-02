//@flow
import React from "react";
import { withStyles } from "material-ui/styles";
import colors from "../../shared/colors";

const style = {
  icon: {
    width: "16px",
    height: "12px"
  }
};

function Comment({
  classes
}: {
  classes: { [_: $Keys<typeof styles>]: string }
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 30 22.38"
      fill={colors.argile}
      className={classes.icon}
    >
      <title>comment_1</title>
      <g id="Layer_2" data-name="Layer 2">
        <g id="Solid">
          <path d="M30,9a9,9,0,0,0-9-9H9A9,9,0,0,0,0,9v1.87c0,2.24,0,11.5,0,11.5a81.35,81.35,0,0,1,9-2.5H21a9,9,0,0,0,9-9ZM11,12.38H7v-4h4Zm6,0H13v-4h4Zm6,0H19v-4h4Z" />
        </g>
      </g>
    </svg>
  );
}

export default withStyles(style)(Comment);
