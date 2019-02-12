// @flow
import React from "react";

import MenuLink from "components/MenuLink";
import Box from "components/base/Box";
import Text from "components/base/Text";

import colors from "shared/colors";

type MenuItemProps = {
  to: string,
  Icon: React$ComponentType<*>,
  disabled?: boolean,
  dataTest?: string,
  children: React$Node
};

function MenuItem({ to, Icon, disabled, dataTest, children }: MenuItemProps) {
  return (
    <MenuLink to={to} data-test={dataTest} disabled={disabled}>
      <Box horizontal color={colors.black} align="center" flow={10}>
        <Icon />
        <Text small uppercase>
          {children}
        </Text>
      </Box>
    </MenuLink>
  );
}

export default MenuItem;
