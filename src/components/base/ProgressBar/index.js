// @flow
import React from "react";
import { FaSpinner } from "react-icons/fa";

import Box from "components/base/Box";

export default ({
  progress,
  indeterminate,
}: {
  progress: number,
  indeterminate: boolean,
}) => (
  <Box justify="center" style={{ height: 50, border: "1px solid black" }} p={2}>
    {indeterminate ? (
      <FaSpinner size={20} />
    ) : (
      <Box style={{ width: `${progress}%`, height: 50, background: "black" }} />
    )}
  </Box>
);
