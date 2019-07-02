// @flow

import React from "react";
import { FaPlus } from "react-icons/fa";
import ButtonBase from "@material-ui/core/ButtonBase";
import styled from "styled-components";
import type { MemoryHistory } from "history";
import type { Location } from "react-router-dom";

import colors from "shared/colors";
import AccountName from "components/AccountName";
import VaultLink from "components/VaultLink";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import Card from "components/base/Card";
import Box from "components/base/Box";
import Text from "components/base/Text";
import Button from "components/base/Button";
import SearchAccounts from "api/queries/SearchAccounts";
import type { Account } from "data/types";
import type { Connection } from "restlay/ConnectionQuery";
import { useMe } from "components/UserContextProvider";
import Widget, { connectWidget } from "./Widget";

const IconPlus = () => <FaPlus size={12} />;

type Props = {
  accountsConnection: Connection<Account>,
  history: MemoryHistory,
  location: Location,
};

function AccountsWidget(props: Props) {
  const { accountsConnection, history, location } = props;
  const me = useMe();
  const accounts = accountsConnection.edges.map(n => n.node);
  const onAdd = () => history.push(`${location.pathname}/accounts/new`);
  const addButton = (
    <Button type="submit" variant="filled" IconLeft={IconPlus} onClick={onAdd}>
      Create an account
    </Button>
  );
  return (
    <Widget title="Accounts" height={accounts.length ? undefined : 300}>
      <Card grow flow={20}>
        {accounts.length ? (
          <>
            <Box grow>
              {accounts.map(account => (
                <VaultLink
                  withRole
                  key={account.id}
                  to={`/accounts/view/${account.id}`}
                >
                  <StyledButton>
                    <AccountName account={account} />
                    <CurrencyAccountValue
                      account={account}
                      value={account.balance}
                    />
                  </StyledButton>
                </VaultLink>
              ))}
            </Box>
          </>
        ) : me.role === "ADMIN" ? (
          <Box grow align="center" justify="center">
            {addButton}
          </Box>
        ) : (
          <Box grow align="center" justify="center">
            <Text color={colors.textLight}>No accounts.</Text>
          </Box>
        )}
      </Card>
    </Widget>
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

export default connectWidget(AccountsWidget, {
  height: 300,
  queries: {
    accountsConnection: SearchAccounts,
  },
  propsToQueryParams: () => ({
    meta_status: "ACTIVE",
  }),
});
