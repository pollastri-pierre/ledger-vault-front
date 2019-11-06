// @flow

import React from "react";
import { FaPlus } from "react-icons/fa";

import Button from "components/base/Button";
import Text from "components/base/Text";
import Box from "components/base/Box";

const Icon = () => <FaPlus size={10} />;

export default ({
  onClick,
  label,
}: {
  onClick: () => void,
  label: React$Node,
}) => (
  <Button size="slim" type="filled" data-test="add-button" onClick={onClick}>
    <Box horizontal flow={5} justify="center" align="center">
      <Icon />
      <Text>{label}</Text>
    </Box>
  </Button>
);
