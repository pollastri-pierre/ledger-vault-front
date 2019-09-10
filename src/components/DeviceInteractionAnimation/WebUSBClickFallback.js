// @flow

import React from "react";
import { FaUsb } from "react-icons/fa";

import Button from "components/base/Button";

const WebUSBClickFallback = ({ onClick }: { onClick: () => void }) => (
  <Button IconLeft={FaUsb} type="submit" variant="filled" onClick={onClick}>
    Click to connect
  </Button>
);

export default WebUSBClickFallback;
