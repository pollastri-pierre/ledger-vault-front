import React from "react";

function Rates(props) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 25 30" {...props}>
      <title>rates</title>
      <g id="Layer_2" data-name="Layer 2">
        <g id="Line">
          <g id="Rate">
            <line
              style={{ fill: "none", strikeMiterlimit: 10 }}
              x1="1"
              x2="1"
              y2="30"
            />
            <line
              style={{ fill: "none", strikeMiterlimit: 10 }}
              x1="9"
              y1="10"
              x2="9"
              y2="30"
            />
            <line
              style={{ fill: "none", strikeMiterlimit: 10 }}
              x1="17"
              y1="5.69"
              x2="17"
              y2="30"
            />
            <line
              style={{ fill: "none", strikeMiterlimit: 10 }}
              x1="24"
              y1="15.42"
              x2="24"
              y2="30"
            />
          </g>
        </g>
      </g>
    </svg>
  );
}

export default Rates;
