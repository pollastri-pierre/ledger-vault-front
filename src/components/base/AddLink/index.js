// @flow

import React from "react";
import Button from "@material-ui/core/Button";
import { FaPlus } from "react-icons/fa";

export default ({
  onClick,
  children,
}: {
  onClick: () => void,
  children: *,
}) => (
  <Button onClick={onClick} color="primary" variant="outlined">
    <FaPlus style={{ marginRight: 10 }} />
    {children}
  </Button>
);
