// @flow
import { Trans } from "react-i18next";
import { withRouter } from "react-router";
import React, { Component } from "react";
import type { MemoryHistory } from "history";
import styled from "styled-components";

import { isAccountOutdated } from "utils/accounts";
import Text from "components/base/Text";
import Box from "components/base/Box";
import type { Account } from "data/types";
import Button from "components/legacy/Button";
import colors, { opacity, darken } from "shared/colors";

type Props = {
  history: MemoryHistory,
  account: Account,
};

class AccountWarning extends Component<Props> {
  editAccount = () => {
    const { history, account } = this.props;
    history.push(`${location.pathname}/accounts/edit/${account.id}`);
  };

  render() {
    const { account } = this.props;

    const showViewOnlyWarning =
      account.status === "VIEW_ONLY" &&
      (account.last_request === null ||
        (account.last_request && account.last_request.status === "ABORTED"));

    const isOutdated = isAccountOutdated(account);

    if (!showViewOnlyWarning && !isOutdated) return null;

    return (
      <Box align="center">
        {showViewOnlyWarning && (
          <Warning>
            <Text>
              <Trans i18nKey="accountView:view_only_warning" />
            </Text>
            <Button
              onClick={this.editAccount}
              variant="filled"
              customColor={darken(colors.warning, 0.2)}
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
            <Button
              onClick={this.editAccount}
              variant="filled"
              data-test="view_only_provide_rules"
              customColor={darken(colors.warning, 0.2)}
            >
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
