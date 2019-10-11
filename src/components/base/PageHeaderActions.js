// @flow

import React from "react";

import { withMe } from "components/UserContextProvider";
import Box from "components/base/Box";
import Text from "components/base/Text";
import AddLink from "components/base/AddLink";

import type { User } from "data/types";

type PageHeaderActionsProps = {
  me: User,
  onClick?: () => void,
  label?: React$Node,
  title?: React$Node,
  children?: React$Node,
};

function PageHeaderActions(props: PageHeaderActionsProps) {
  const { me, onClick, label, title, children } = props;
  return (
    <Box horizontal align="flex-start" justify="space-between" pb={20}>
      {title && (
        <Box px={5}>
          <Text bold header>
            {title}
          </Text>
        </Box>
      )}
      <Box noShrink>
        {me.role === "ADMIN" && onClick && label && (
          <AddLink onClick={onClick} label={<Text>{label}</Text>} />
        )}
        {children}
      </Box>
    </Box>
  );
}

export default withMe(PageHeaderActions);
