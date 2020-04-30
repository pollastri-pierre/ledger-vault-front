// @flow

import React, { useMemo } from "react";
import styled from "styled-components";

import colors from "shared/colors";
import AccountIcon from "components/AccountIcon";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import Box from "components/base/Box";
import Text from "components/base/Text";
import { getCurrencyOrTokenName } from "utils/accounts";
import type { Account } from "data/types";

import { List, ListEmpty, ListItem } from "./List";

type Display = "list" | "grid";

export type AccountsListConfig = {|
  displayBalance: boolean,
|};

type Props = {
  accounts: Account[],
  display?: Display,
  tileWidth?: number,
  compact?: boolean,
  config?: AccountsListConfig,
};

const DEFAULT_CONFIG: AccountsListConfig = {
  displayBalance: true,
};

export default function AccountsList(props: Props) {
  const { accounts, display, tileWidth, compact, config: _config } = props;

  const config: AccountsListConfig = useMemo(
    () => ({ ...DEFAULT_CONFIG, ..._config }),
    [_config],
  );

  if (!accounts.length) {
    return <ListEmpty>No accounts</ListEmpty>;
  }

  return (
    <List display={display} compact={compact}>
      {accounts.map(account => (
        <ListItem
          display={display}
          tileWidth={tileWidth}
          compact={compact}
          key={account.id}
          to={`/accounts/view/${account.id}`}
        >
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
            {config.displayBalance && (
              <Box align="flex-end">
                <Row size={13}>
                  <div>Available Balance</div>
                  <Text fontWeight="bold">
                    <CurrencyAccountValue
                      account={account}
                      value={account.available_balance}
                    />
                  </Text>
                </Row>
                <Row>
                  <div>Total</div>
                  <Text fontWeight="semiBold">
                    <CurrencyAccountValue
                      account={account}
                      value={account.balance}
                    />
                  </Text>
                </Row>
              </Box>
            )}
          </Box>
        </ListItem>
      ))}
    </List>
  );
}
const Row = styled(Box).attrs({ horizontal: true, align: "center", flow: 5 })`
  font-size: ${p => p.size}px;
`;
