// @flow

import React from "react";
import { FaPlus } from "react-icons/fa";
import Button from "components/base/Button";

const Icon = () => <FaPlus size={12} />;

export default ({
  onClick,
  children,
}: {
  onClick: () => void,
  children: *,
}) => (
  <Button
    onClick={onClick}
    type="submit"
    variant="filled"
    IconLeft={Icon}
    size="small"
  >
    {children}
  </Button>
);
