// @flow

import React from "react";
import { FaPlus } from "react-icons/fa";
import Button from "components/base/Button";

export default ({
  onClick,
  children,
}: {
  onClick: () => void,
  children: *,
}) => (
  <Button onClick={onClick} type="submit" IconLeft={FaPlus} size="small">
    {children}
  </Button>
);
