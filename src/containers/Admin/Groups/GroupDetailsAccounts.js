// @flow

import React, { PureComponent } from "react";
import styled from "styled-components";
import ButtonBase from "@material-ui/core/ButtonBase";
import { Trans } from "react-i18next";

import type { Account } from "data/types";
import connectData from "restlay/connectData";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import NoDataPlaceholder from "components/NoDataPlaceholder";
import AccountsInGroupQuery from "api/queries/AccountsInGroupQuery";
import AccountName from "components/AccountName";
import SpinnerCard from "components/legacy/SpinnerCard";
import Text from "components/base/Text";
import Box from "components/base/Box";
import VaultLink from "components/VaultLink";

type Props = {
  accounts: Account[],
};

class GroupDetailsAccounts extends PureComponent<Props> {
  render() {
    const { accounts } = this.props;
    if (accounts.length === 0) {
      return (
        <NoDataPlaceholder title={<Trans i18nKey="group:no_accounts_yet" />} />
      );
    }
    return (
      <Container>
        {accounts.map(a => (
          <VaultLink key={a.id} to={`/admin/accounts/view/${a.id}`}>
            <AccountButton>
              <Box flow={3}>
                <AccountName account={a} />
                <Text small color="grey">
                  <CurrencyAccountValue account={a} value={a.balance} />
                </Text>
              </Box>
            </AccountButton>
          </VaultLink>
        ))}
      </Container>
    );
  }
}

const AccountButton = styled(ButtonBase)`
  && {
    border: 1px solid #f0f0f0;
    border-radius: 4px;
    padding: 15px;
  }
`;

const Container = styled(Box).attrs({
  horizontal: true,
})`
  align: flex-start;
  flex-wrap: wrap;

  > * {
    margin-right: 10px !important;
    margin-bottom: 10px !important;
  }
`;

const RenderLoading = () => <SpinnerCard />;

export default connectData(GroupDetailsAccounts, {
  RenderLoading,
  queries: {
    accounts: AccountsInGroupQuery,
  },
  propsToQueryParams: props => ({
    groupId: props.group.id,
  }),
});
