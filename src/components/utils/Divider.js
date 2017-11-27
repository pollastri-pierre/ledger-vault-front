//@flow
import React from "react";
import "./Divider.css";

function Divider(props: { className: string }) {
  return (
    <div {...props} className={`divider ${props.className}`}>
      &nbsp;
    </div>
  );
}

Divider.defaultProps = {
  className: ""
};

export default Divider;
