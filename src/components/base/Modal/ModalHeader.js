// @flow

import React from "react";

import Box from "components/base/Box";
import Text from "components/base/Text";
import { ModalClose } from "./components";

export default ({
  onClose,
  title,
  children,
}: {
  onClose: () => void,
  title?: React$Node,
  children?: React$Node,
}) => (
  <Box horizontal align="center" justify="space-between" p={20} noShrink>
    {children && children}
    {title && (
      <Text header bold>
        {title}
      </Text>
    )}
    <ModalClose onClick={onClose} />
  </Box>
);
