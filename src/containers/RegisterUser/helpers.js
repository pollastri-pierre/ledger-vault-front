// @flow
import React from "react";
import { FaUser } from "react-icons/fa";

import Box from "components/base/Box";
import Text from "components/base/Text";

import AdminIcon from "components/icons/AdminIcon";
import OperatorIcon from "components/icons/OperatorIcon";
import type { UserInvite } from "data/types";

import colors from "shared/colors";

export function Row(props: { label: string, text: ?string }) {
  const { label, text } = props;
  return (
    <Box horizontal flow={5}>
      <Text uppercase fontWeight="bold" i18nKey={label} />
      <Text>{text || ""}</Text>
    </Box>
  );
}
export function getStringError(error: Object) {
  if (!error || !error.json || !error.json.message) return null;
  return error.json.message;
}

export function userRoleIcon(userInvite: ?UserInvite) {
  if (userInvite) {
    switch (userInvite.user.role) {
      case "ADMIN":
        return <AdminIcon size={20} color={colors.green} />;
      case "OPERATOR":
        return <OperatorIcon size={20} color={colors.ocean} />;
      default:
        return <FaUser />;
    }
  } else {
    return <FaUser />;
  }
}
