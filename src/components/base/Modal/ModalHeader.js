// @flow

import React from "react";
import Box from "components/base/Box";
import ModalClose from "components/base/Modal/ModalClose";
import Text from "components/base/Text";

export default ({
  onClose,
  title,
  children
}: {
  onClose: () => void,
  title?: React$Node,
  children?: React$Node
}) => (
  <Box horizontal align="center" justify="space-between" p={20}>
    {children && children}
    {title && (
      <Text header bold>
        {title}
      </Text>
    )}
    <ModalClose onClick={onClose} />
  </Box>
);
