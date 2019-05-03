// @flow

import React from "react";

const WrappingKeyIcon = ({
  size,
  color,
  ...p
}: {
  size: number,
  color: string,
}) => (
  <svg viewBox="0 0 38.57 35.88" height={size} width={size} {...p}>
    <path
      fill={color}
      d="M10.78 16.82a8.38 8.38 0 0 0 8.44 0 8.74 8.74 0 0 0 3.08-3.08 8.17 8.17 0 0 0 1.14-4.22A8.17 8.17 0 0 0 22.3 5.3a8.63 8.63 0 0 0-3.08-3.07 8.32 8.32 0 0 0-8.44 0A8.52 8.52 0 0 0 7.71 5.3a8.09 8.09 0 0 0-1.15 4.22 8.09 8.09 0 0 0 1.15 4.22 8.63 8.63 0 0 0 3.07 3.08zM9.32 6.24a6.29 6.29 0 0 1 2.4-2.4 6.55 6.55 0 0 1 6.56 0 6.29 6.29 0 0 1 2.4 2.4 6.55 6.55 0 0 1 0 6.56 6.38 6.38 0 0 1-2.4 2.41 6.62 6.62 0 0 1-6.56 0 6.38 6.38 0 0 1-2.4-2.41 6.55 6.55 0 0 1 0-6.56zM19.41 29.21H1.88v-1.88a5.39 5.39 0 0 1 1.64-4 5.43 5.43 0 0 1 4-1.64 20.69 20.69 0 0 1 2.93.17c.47.08 1 .2 1.58.36a7.45 7.45 0 0 0 1.12.29 12.2 12.2 0 0 0 1.87.12 12.44 12.44 0 0 0 1.88-.12 9.63 9.63 0 0 0 1.17-.29 13.17 13.17 0 0 1 1.52-.36 18.06 18.06 0 0 1 2.09-.16v-.26a5.82 5.82 0 0 1 .23-1.62 21.88 21.88 0 0 0-2.61.17c-.47.08-1 .2-1.58.35a4.78 4.78 0 0 1-1.06.29 9.25 9.25 0 0 1-1.64.12 9.25 9.25 0 0 1-1.64-.12 4.58 4.58 0 0 1-1-.29c-.59-.15-1.12-.27-1.59-.35a23.37 23.37 0 0 0-3.25-.18 7.41 7.41 0 0 0-3.75 1A7.25 7.25 0 0 0 1 23.55a7.42 7.42 0 0 0-1 3.78v1.88a1.81 1.81 0 0 0 .56 1.32 1.8 1.8 0 0 0 1.32.55h17.53zM37.18 23.66a2 2 0 0 0-1.46-.6h-.18v-1.84a6 6 0 0 0-.81-3A6.1 6.1 0 0 0 32.56 16a6 6 0 0 0-9 5.17v1.88h-.19a2.07 2.07 0 0 0-2.07 2.06v6.75a2.07 2.07 0 0 0 2.07 2.06h12.35a2.07 2.07 0 0 0 2.07-2.06v-6.74a2 2 0 0 0-.61-1.46zm-5.56-6.06a4.12 4.12 0 0 1 2 3.58v1.88h-8.21v-1.88A4 4 0 0 1 26 19.1a4.12 4.12 0 0 1 1.49-1.5 4.3 4.3 0 0 1 4.13 0zm-8.46 7.52c0-.08 0-.12.05-.14s.06-.05.14-.05h12.37c.08 0 .12 0 .14.05s0 .06 0 .14v6.75a.17.17 0 0 1 0 .14.19.19 0 0 1-.14 0H23.21c-.02 0-.05-.05-.05-.13z"
    />
    <path
      fill={color}
      d="M29.54 30.7a1.09 1.09 0 0 0 .75-.32 1.07 1.07 0 0 0 .32-.76v-2.25a1.05 1.05 0 0 0-.32-.76 1.06 1.06 0 0 0-1.51 0 1.05 1.05 0 0 0-.32.76v2.25a1.07 1.07 0 0 0 .32.76 1.09 1.09 0 0 0 .76.32z"
    />
  </svg>
);

export default WrappingKeyIcon;