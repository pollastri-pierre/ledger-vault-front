// @flow

import React from "react";

const path = (
  <path
    fill="currentColor"
    d="M8 6.75c-.69035594 0-1.25.55964406-1.25 1.25v4.6666667c0 .6903559.55964406 1.25 1.25 1.25h4.6666667c.6903559 0 1.25-.5596441 1.25-1.25V8c0-.69035594-.5596441-1.25-1.25-1.25H8zm0-1.5h4.6666667c1.518783 0 2.75 1.23121694 2.75 2.75v4.6666667c0 1.518783-1.231217 2.75-2.75 2.75H8c-1.51878306 0-2.75-1.231217-2.75-2.75V8c0-1.51878306 1.23121694-2.75 2.75-2.75zm-4.66666667 4c.41421357 0 .75.33578644.75.75 0 .4142136-.33578643.75-.75.75h-.66666666c-1.15059323 0-2.08333334-.9327401-2.08333334-2.08333333v-6c0-1.15059323.93274011-2.08333334 2.08333334-2.08333334h6C9.8172599.58333333 10.75 1.51607344 10.75 2.66666667v.66666666c0 .41421357-.3357864.75-.75.75-.41421356 0-.75-.33578643-.75-.75v-.66666666c0-.32216611-.26116723-.58333334-.58333333-.58333334h-6c-.32216611 0-.58333334.26116723-.58333334.58333334v6c0 .3221661.26116723.58333333.58333334.58333333h.66666666z"
  />
);

export default ({ size, ...p }: { size: number }) => (
  <svg viewBox="0 0 16 16" height={size} width={size} {...p}>
    {path}
  </svg>
);
