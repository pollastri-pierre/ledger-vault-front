// @flow

import React from "react";

import { useMe } from "components/UserContextProvider";
import Box from "components/base/Box";
import Text from "components/base/Text";

import colors from "shared/colors";

export default function useAvatar() {
  const me = useMe();
  return (
    <Box
      p={8}
      borderRadius={50}
      width={30}
      height={30}
      align="center"
      justify="center"
      bg={
        me.role === "ADMIN" ? colors.legacyDeviceBlue : colors.legacyDeviceGreen
      }
    >
      <Text color={colors.white}>{me.username.charAt(0)}</Text>
    </Box>
  );
}
