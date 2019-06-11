// @flow

import React, { Component } from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";
import { Link } from "react-router-dom";

import { isAccountOutdated } from "utils/accounts";
import { getERC20TokenByContractAddress } from "utils/cryptoCurrencies";
import colors from "shared/colors";

import Card from "components/base/Card";
import { Label } from "components/base/form";
import Absolute from "components/base/Absolute";
import Box from "components/base/Box";
import Text from "components/base/Text";
import CurrencyIndex from "components/CurrencyIndex";
import { FaWrench } from "react-icons/fa";
import type { Account } from "data/types";
import AccountWarning from "./AccountWarning";

const Row = ({ label, value }: { label: React$Node, value: ?React$Node }) => (
  <Box horizontal flow={5}>
    <Box>
      <Text bold>{label}:</Text>
    </Box>
    {value && <Box>{value}</Box>}
  </Box>
);

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

    const isERC20 = account.account_type === "ERC20";
    const token = isERC20
      ? getERC20TokenByContractAddress(account.contract_address)
      : null;

    return (
      <Card grow>
        <Label>
          <AccountTitle account={account} />
        </Label>
        {!isERC20 && (
          <Absolute top={0} right={0}>
            <SettingsLink
              title="Settings"
              to={`${location.pathname}/accounts/details/${
                account.id
              }/overview`}
              className="content-header-button"
            >
              <FaWrench />
            </SettingsLink>
          </Absolute>
        )}
        <Box horizontal align="center" justify="space-between">
          <Box>
            {isERC20 ? (
              <Row
                label={<Trans i18nKey="accountView:summary.token" />}
                value={token && token.name}
              />
            ) : (
              <Row
                label={<Trans i18nKey="accountView:summary.index" />}
                value={
                  <CurrencyIndex
                    currency={account.currency}
                    index={account.index}
                  />
                }
              />
            )}
            {account.account_type === "ERC20" && account.parent_id && (
              <>
                <Row
                  label={<Trans i18nKey="accountView:summary.token_address" />}
                  value={account.contract_address}
                />
                <Row
                  label={<Trans i18nKey="accountView:summary.parent_account" />}
                  value={<Link to={`${account.parent_id}`}>ETH account</Link>}
                />
              </>
            )}
          </Box>
          <AccountWarning account={account} />
        </Box>
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
