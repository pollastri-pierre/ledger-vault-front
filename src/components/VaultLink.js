// @flow

import React from "react";
import { Link } from "react-router-dom";

import { useMe } from "components/UserContextProvider";

type Props = {
  to: string,
  withRole?: boolean,
};

function VaultLink({ to, withRole, ...props }: Props) {
  const me = useMe();
  let prefix = window.location.pathname.split("/")[1];
  if (withRole) {
    prefix += `/${me.role.toLowerCase()}`;
  }
  const resolvedTo = `/${prefix}${to}`;
  return <Link to={resolvedTo} {...props} />;
}

export default VaultLink;
