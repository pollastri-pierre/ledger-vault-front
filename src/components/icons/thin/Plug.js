//@flow
import React from "react";

function Plug(props: { fill: string }) {
  const { fill } = props;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 20.12" {...props}>
      <title> plug</title>
      <g id="Layer_2" data-name="Layer 2">
        <g id="Line">
          <g id="USB">
            <rect
              x="0.51"
              y="1.49"
              width="18.12"
              height="17.14"
              transform="translate(19.63 0.49) rotate(90)"
            />
            <rect
              x="18.14"
              y="3.63"
              width="12.86"
              height="12.86"
              transform="translate(34.63 -14.51) rotate(90)"
            />
            <rect
              fill={fill}
              stroke="none"
              x="23.57"
              y="5.22"
              width="2"
              height="4.84"
              transform="translate(32.21 -16.93) rotate(90)"
            />
            <rect
              fill={fill}
              stroke="none"
              x="23.57"
              y="10.06"
              width="2"
              height="4.84"
              transform="translate(37.05 -12.09) rotate(90)"
            />
          </g>
        </g>
      </g>
    </svg>
  );
}

export default Plug;
