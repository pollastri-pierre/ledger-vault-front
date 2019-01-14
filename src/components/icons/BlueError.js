// @flow

import React from "react";

const BlueError = ({ size }: { size: number }) => (
  <svg
    width={size}
    height={size * 2}
    viewBox="0 0 497 1024"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <defs>
      <linearGradient
        x1="49.13%"
        y1="40.606%"
        x2="50%"
        y2="92.614%"
        id="linearGradient-1"
      >
        <stop stopColor="#FFF" stopOpacity="0" offset="0%" />
        <stop stopColor="#FFF" offset="100%" />
      </linearGradient>
      <path
        d="M252.755602,350 L278.342608,324.412994 C279.219131,323.536472 279.219131,322.119116 278.342608,321.242593 L276.757407,319.657392 C275.880884,318.780869 274.463528,318.780869 273.587006,319.657392 L248,345.244398 L222.412994,319.676042 C221.536472,318.799519 220.119116,318.799519 219.242593,319.676042 L217.657392,321.261242 C216.780869,322.137765 216.780869,323.555121 217.657392,324.431644 L243.244398,350 L217.676042,375.587006 C216.799519,376.463528 216.799519,377.880884 217.676042,378.757407 L219.261242,380.342608 C220.137765,381.219131 221.555121,381.219131 222.431644,380.342608 L248,354.755602 L273.587006,380.342608 C274.463528,381.219131 275.880884,381.219131 276.757407,380.342608 L278.342608,378.757407 C279.219131,377.880884 279.219131,376.463528 278.342608,375.587006 L252.755602,350 Z"
        id="path-2"
      />
    </defs>
    <g id="blue-error" fill="none" fillRule="evenodd">
      <rect fill="#FFF" width="497" height="1024" />
      <g id="Group">
        <g id="Group-7" transform="translate(218 653)" stroke="#1D2027">
          <path
            d="M4.49999988,43.1934748 L4.49999988,135.875114 C4.49999988,139.851564 7.7235496,143.075114 11.6999997,143.075114 L49.3000003,143.075114 C53.2764504,143.075114 56.5000001,139.851564 56.5000001,135.875114 L56.5000001,43.1934748 L4.49999988,43.1934748 Z"
            id="Rectangle-7"
            strokeWidth="9"
          />
          <rect
            id="Rectangle-7-Copy"
            strokeWidth="7"
            x="21.441"
            y="142.077"
            width="18.118"
            height="34.393"
            rx="4.5"
          />
          <path
            d="M25.4264706,588.724874 L35.5735294,579.111741 L35.5735294,180.870258 C35.5735294,180.041831 34.9019566,179.370258 34.0735295,179.370258 L26.9264705,179.370258 C26.0980434,179.370258 25.4264706,180.041831 25.4264706,180.870258 L25.4264706,588.724874 Z"
            id="Rectangle-7-Copy-2"
            strokeWidth="6"
          />
          <rect
            id="Rectangle-8"
            strokeWidth="3.6"
            x="12.565"
            y="1.8"
            width="35.871"
            height="39.593"
            rx="4.5"
          />
          <path
            d="M20.6323529,7.64871017 L20.6323529,29.263807"
            id="Line-4"
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M40.3676471,7.64871017 L40.3676471,29.263807"
            id="Line-4-Copy"
            strokeWidth="3.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <rect
          id="Rectangle-3"
          fill="url(#linearGradient-1)"
          fillRule="nonzero"
          x="195"
          y="700"
          width="115"
          height="324"
        />
        <g id="Group-4">
          <rect
            id="Rectangle-2"
            stroke="#1D2027"
            strokeWidth="5"
            fill="#D8424E"
            x="484.5"
            y="90.5"
            width="10"
            height="46"
            rx="5"
          />
          <rect
            id="Rectangle"
            stroke="#1D2027"
            strokeWidth="10"
            fill="#FBD5DB"
            x="5"
            y="5"
            width="482"
            height="690"
            rx="30"
          />
          <rect
            id="Rectangle-Copy"
            stroke="#EA2E49"
            strokeWidth="4"
            fill="#FFF"
            x="62"
            y="77"
            width="368"
            height="546"
            rx="10"
          />
          <mask id="mask-3" fill="#fff">
            <use xlinkHref="#path-2" />
          </mask>
          <use
            id="Shape"
            fill="#EA2E49"
            fillRule="nonzero"
            xlinkHref="#path-2"
          />
        </g>
      </g>
    </g>
  </svg>
);

export default BlueError;
