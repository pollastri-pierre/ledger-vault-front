// @flow

import React from "react";
import ButtonBase from "@material-ui/core/ButtonBase";
import styled from "styled-components";

import AccountName from "components/AccountName";
import VaultLink from "components/VaultLink";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import Box from "components/base/Box";
import type { Account } from "data/types";

type Props = {
  accounts: Account[],
};

export default function AccountsList(props: Props) {
  const { accounts } = props;
  return (
    <Box>
      {accounts.map(account => (
        <VaultLink
          withRole
          key={account.id}
          to={`/accounts/view/${account.id}`}
        >
          <StyledButton>
            <AccountName account={account} />
            <CurrencyAccountValue account={account} value={account.balance} />
          </StyledButton>
        </VaultLink>
      ))}
    </Box>
  );
}

const StyledButton = styled(ButtonBase)`
  && {
    width: 100%;
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
`;
