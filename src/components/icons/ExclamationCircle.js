// @flow

import React from "react";

const path = (
  <path
    fill="currentColor"
    d="M8 .25C3.72009375.25.25 3.72134375.25 8c0 4.2811563 3.47009375 7.75 7.75 7.75 4.2799062 0 7.75-3.4688437 7.75-7.75C15.75 3.72134375 12.2799062.25 8 .25zm0 14c-3.454125 0-6.25-2.7947187-6.25-6.25 0-3.45296875 2.796-6.25 6.25-6.25 3.4528437 0 6.25 2.79596875 6.25 6.25 0 3.4540625-2.7947187 6.25-6.25 6.25zM9.3125 11c0 .7237187-.58878125 1.3125-1.3125 1.3125S6.6875 11.7237187 6.6875 11 7.27628125 9.6875 8 9.6875 9.3125 10.2762813 9.3125 11zM6.7696875 4.39371875l.2125 4.25C6.99215625 8.8433125 7.15690625 9 7.35671875 9h1.2865625c.1998125 0 .3645625-.1566875.37453125-.35628125l.2125-4.25C9.24103125 4.17953125 9.07025 4 8.85578125 4h-1.7115625c-.21446875 0-.38525.17953125-.37453125.39371875z"
  />
);

const ExclamationCircle = ({ size, ...p }: { size: number }) => (
  <svg viewBox="0 0 16 16" height={size} width={size} {...p}>
    {path}
  </svg>
);

export default ExclamationCircle;
