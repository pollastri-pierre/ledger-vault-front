// @flow

import React from "react";
import Box from "components/base/Box";

export default ({ children }: { children: React$Node }) => (
  <Box p={20} mb={50}>
    {children}
  </Box>
);
