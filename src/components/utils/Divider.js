// @flow
import React from "react";

function Divider(props: { className?: string }) {
  return (
    <div {...props} className={`divider ${props.className || ""}`}>
      &nbsp;
    </div>
  );
}

export default Divider;
