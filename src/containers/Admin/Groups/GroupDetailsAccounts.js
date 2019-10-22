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
import type { Connection } from "restlay/ConnectionQuery";

import colors from "shared/colors";

type Props = {
  accounts: Connection<Account>,
};

class GroupDetailsAccounts extends PureComponent<Props> {
  render() {
    const { accounts } = this.props;
    const allAccounts = accounts.edges.map(e => e.node);
    if (allAccounts.length === 0) {
      return (
        <NoDataPlaceholder title={<Trans i18nKey="group:no_accounts_yet" />} />
      );
    }
    return (
      <Container>
        {allAccounts.map(a => (
          <VaultLink key={a.id} to={`/admin/accounts/view/${a.id}`}>
            <AccountButton>
              <Box flow={3}>
                <AccountName account={a} />
                <Text size="small" color="grey">
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
    border: 1px solid ${colors.legacyLightGrey1};
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
