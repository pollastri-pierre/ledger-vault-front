// @flow

import React from "react";
import { FaUsb } from "react-icons/fa";

import Button from "components/base/Button";
import Box from "components/base/Box";
import Text from "components/base/Text";

const WebUSBClickFallback = ({ onClick }: { onClick: () => void }) => (
  <Button type="primary" onClick={onClick}>
    <Box horizontal flow={5} align="center">
      <FaUsb />
      <Text> Click to connect</Text>
    </Box>
  </Button>
);

export default WebUSBClickFallback;
