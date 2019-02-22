// @flow

import React from "react";
import { FaFilter } from "react-icons/fa";

import Box from "components/base/Box";
import Text from "components/base/Text";

export default ({
  children,
  isActive
}: {
  children: React$Node,
  isActive: boolean
}) => (
  <Text small uppercase bold={isActive}>
    <Box horizontal align="center" flow={5}>
      {isActive && <FaFilter />}
      <span>{children}</span>
    </Box>
  </Text>
);
