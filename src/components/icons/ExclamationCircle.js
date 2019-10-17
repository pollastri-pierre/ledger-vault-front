// @flow

import React from "react";

const ExclamationCircle = ({
  size,
  color,
  ...p
}: {
  size: number,
  color: string,
}) => (
  <svg viewBox="0 0 44 44" height={size} width={size} {...p}>
    <path
      fill={color}
      d="M22 3.438c10.194 0 18.563 8.256 18.563 18.562 0 10.252-8.303 18.563-18.563 18.563-10.248 0-18.563-8.299-18.563-18.563C3.438 11.756 11.74 3.437 22 3.437zm0-2.75C10.23.688.687 10.233.687 22 .688 33.773 10.23 43.313 22 43.313S43.313 33.773 43.313 22C43.313 10.234 33.77.687 22 .687zM21.013 11h1.974a1.03 1.03 0 011.03 1.074l-.6 14.438a1.031 1.031 0 01-1.031.988h-.772a1.031 1.031 0 01-1.03-.988l-.602-14.438A1.031 1.031 0 0121.012 11zM22 29.219a2.406 2.406 0 100 4.812 2.406 2.406 0 000-4.812z"
    />
  </svg>
);

export default ExclamationCircle;
