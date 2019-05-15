// @flow

import React from "react";
import { FaPlus } from "react-icons/fa";
import Button from "components/base/Button";
import Absolute from "components/base/Absolute";

const Icon = () => <FaPlus size={12} />;

export default ({
  onClick,
  children,
}: {
  onClick: () => void,
  children: *,
}) => (
  <Absolute top={20} right={20}>
    <Button
      onClick={onClick}
      data-test="buttonCreate"
      type="submit"
      variant="filled"
      IconLeft={Icon}
      size="small"
    >
      {children}
    </Button>
  </Absolute>
);
