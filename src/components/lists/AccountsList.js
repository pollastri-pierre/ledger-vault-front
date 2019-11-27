// @flow

import React from "react";

import colors from "shared/colors";
import AccountIcon from "components/AccountIcon";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import Box from "components/base/Box";
import Text from "components/base/Text";
import { getCurrencyOrTokenName } from "utils/accounts";
import type { Account } from "data/types";

import { List, ListEmpty, ListItem } from "./List";

type Props = {
  accounts: Account[],
};

export default function AccountsList(props: Props) {
  const { accounts } = props;

  if (!accounts.length) {
    return <ListEmpty>No accounts</ListEmpty>;
  }

  return (
    <List>
      {accounts.map(account => (
        <ListItem key={account.id} to={`/accounts/view/${account.id}`}>
          <Box horizontal align="center">
            <Box grow>
              <Box horizontal align="center" flow={10} pr={10}>
                <Box noShrink>
                  <AccountIcon account={account} />
                </Box>
                <Text ellipsis>{account.name}</Text>
              </Box>
              <Box ml={26}>
                <Text size="small" color={colors.mediumGrey} uppercase>
                  {getCurrencyOrTokenName(account)}
                </Text>
              </Box>
            </Box>
            <Box noShrink>
              <Text fontWeight="semiBold">
                <CurrencyAccountValue
                  account={account}
                  value={account.balance}
                />
              </Text>
            </Box>
          </Box>
        </ListItem>
      ))}
    </List>
  );
}
