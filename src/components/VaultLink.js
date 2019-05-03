// @flow

import React from "react";
import { Link } from "react-router-dom";

type Props = {
  to: string,
};

function VaultLink({ to, ...props }: Props) {
  const prefix = window.location.pathname.split("/")[1];
  const resolvedTo = `/${prefix}${to}`;
  return <Link to={resolvedTo} {...props} />;
}

export default VaultLink;
