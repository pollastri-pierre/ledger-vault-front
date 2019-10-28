// @flow
import { Trans } from "react-i18next";
import { withRouter } from "react-router";
import React, { Component } from "react";
import type { MemoryHistory } from "history";
import styled from "styled-components";

import { isAccountOutdated } from "utils/accounts";
import NextRequestButton from "components/NextRequestButton";
import Text from "components/base/Text";
import Box from "components/base/Box";
import type { Account, User } from "data/types";
import Button from "components/base/Button";
import colors, { opacity, darken } from "shared/colors";

type Props = {
  history: MemoryHistory,
  account: Account,
  me: User,
};

class AccountWarning extends Component<Props> {
  editAccount = () => {
    const { history, account } = this.props;
    history.push(`${location.pathname}/accounts/edit/${account.id}`);
  };

  render() {
    const { account, me } = this.props;

    const showViewOnlyWarning =
      account.status === "VIEW_ONLY" &&
      (account.last_request === null ||
        (account.last_request && account.last_request.status === "ABORTED") ||
        (account.last_request && account.last_request.status === "EXPIRED"));

    const showAccountNotActiveWarning =
      account.status === "APPROVED" && me.role === "ADMIN";

    const isOutdated = isAccountOutdated(account);

    const onRetrySuccess = () => document.location.reload();

    if (!showViewOnlyWarning && !isOutdated && !showAccountNotActiveWarning)
      return null;

    return (
      <Box align="center" flow={20}>
        {showAccountNotActiveWarning && (
          <Warning>
            <Text>
              <Trans i18nKey="accountView:not_active_warning" />
            </Text>
            <NextRequestButton
              request={account.last_request}
              onSuccess={onRetrySuccess}
            />
          </Warning>
        )}
        {showViewOnlyWarning && (
          <Warning>
            <Text>
              <Trans i18nKey="accountView:view_only_warning" />
            </Text>
            <Button
              onClick={this.editAccount}
              type="outline"
              variant="warning"
              data-test="view_only_provide_rules"
            >
              <Trans i18nKey="accountView:view_only_provide_rules" />
            </Button>
          </Warning>
        )}
        {isOutdated && (
          <Warning>
            <Text>
              <Trans i18nKey="accountView:updated_provide_rule_subtext" />
            </Text>
            <Button onClick={this.editAccount} type="outline" variant="warning">
              <Trans i18nKey="accountView:view_only_provide_rules" />
            </Button>
          </Warning>
        )}
      </Box>
    );
  }
}

const Warning = styled.div`
  border-radius: 4px;
  background: ${opacity(colors.warning, 0.1)};
  color: ${darken(colors.warning, 0.1)};
  font-size: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  > * + * {
    margin-left: 20px !important;
  }
`;

export default withRouter(AccountWarning);
