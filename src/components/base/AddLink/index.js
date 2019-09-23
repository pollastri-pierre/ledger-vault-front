// @flow

import React from "react";
import Tooltip from "@material-ui/core/Tooltip";
import { FaPlus } from "react-icons/fa";

import Button from "components/base/Button";

const Icon = () => <FaPlus size={12} />;

export default ({
  onClick,
  title,
}: {
  onClick: () => void,
  title: React$Node,
}) => (
  <Tooltip title={title} placement="left">
    <Button type="primary" circular onClick={onClick}>
      <Icon />
    </Button>
  </Tooltip>
);
