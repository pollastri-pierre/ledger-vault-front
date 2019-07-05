// @flow

import React, { Component } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import { isAccountOutdated } from "utils/accounts";
import colors from "shared/colors";

import Card from "components/base/Card";
import { Label } from "components/base/form";
import Absolute from "components/base/Absolute";
import CurrencyIndex from "components/CurrencyIndex";
import { FaWrench } from "react-icons/fa";
import type { Account } from "data/types";
import AccountWarning from "./AccountWarning";

type Props = {
  account: Account,
};

/* display only the currency and index if the account needs to be updated */
const AccountTitle = ({ account }: { account: Account }) => (
  <div style={{ fontSize: 23 }}>
    {isAccountOutdated(account) ? (
      <CurrencyIndex index={account.index} currency={account.currency} />
    ) : (
      <div>{account.name}</div>
    )}
  </div>
);

class AccountQuickInfo extends Component<Props> {
  render() {
    const { account } = this.props;

    return (
      <Card grow>
        <Label>
          <AccountTitle account={account} />
        </Label>
        <Absolute top={0} right={0}>
          <SettingsLink
            title="Settings"
            to={`${location.pathname}/accounts/details/${account.id}/overview`}
            className="content-header-button"
          >
            <FaWrench />
          </SettingsLink>
        </Absolute>
        <AccountWarning account={account} />
      </Card>
    );
  }
}

const SettingsLink = styled(Link)`
  height: 50px;
  width: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.mediumGrey};

  &:hover {
    color: ${colors.shark};
  }
`;

export default AccountQuickInfo;
