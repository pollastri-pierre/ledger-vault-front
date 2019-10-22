// @flow

import React from "react";
import { FaUserSecret } from "react-icons/fa";
import Box from "components/base/Box";
import Text from "components/base/Text";

export default function({ stepNumber }: { stepNumber: number }) {
  return (
    <Box
      flow={10}
      horizontal
      align="center"
      p={20}
      style={{
        opacity: 0.5,
        width: "100%",
      }}
    >
      <FaUserSecret size={16} />
      <Text size="small" uppercase>
        approval step {stepNumber}
      </Text>
    </Box>
  );
}
