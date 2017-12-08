//@flow
import React from "react";

function ClockThin(props: *) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" {...props}>
      <title>clock</title>
      <g id="Layer_2" data-name="Layer 2">
        <g id="Line">
          <g id="Time">
            <circle
              style={{
                fill: "none",
                strokeMiterlimit: "10",
                strokeWidth: "2px"
              }}
              cx="16"
              cy="16"
              r="15"
            />
            <polyline
              style={{
                fill: "none",
                strokeMiterlimit: "10",
                strokeWidth: "2px"
              }}
              points="16 7.8 16 16.42 20.96 21"
            />
          </g>
        </g>
      </g>
    </svg>
  );
}

export default ClockThin;
