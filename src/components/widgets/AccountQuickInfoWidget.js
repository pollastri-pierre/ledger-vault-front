// @flow

import React from "react";
import { Trans } from "react-i18next";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaCoins, FaWrench, FaTicketAlt, FaLink } from "react-icons/fa";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import Tooltip from "@material-ui/core/Tooltip";

import EntityStatus from "components/EntityStatus";
import CounterValue from "components/CounterValue";
import IconSend from "components/icons/Send";
import { useMe } from "components/UserContextProvider";
import IconReceive from "components/icons/Receive";
import colors from "shared/colors";
import Box from "components/base/Box";
import Copy from "components/base/Copy";
import Absolute from "components/base/Absolute";
import type { Account } from "data/types";
import { Label } from "components/base/form";
import Button from "components/base/Button";
import Text from "components/base/Text";
import { SoftCard } from "components/base/Card";
import AccountIcon from "components/AccountIcon";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import { getERC20TokenByContractAddress } from "utils/cryptoCurrencies";
import Widget from "./Widget";

type Props = {
  account: Account,
};

function AccountQuickInfoWidget(props: Props) {
  const { account } = props;
  const me = useMe();

  const icon = getIcon(account);
  const displayName = getDisplayName(account);

  const title =
    me.role === "OPERATOR" ? (
      <Box horizontal flow={10}>
        <Link to={`${account.id}/send/${account.id}`}>
          <Button
            IconLeft={IconSend}
            customColor={colors.blue}
            variant="filled"
            size="tiny"
          >
            Send
          </Button>
        </Link>
        <Link to={`${account.id}/receive/${account.id}`}>
          <Button
            IconLeft={IconReceive}
            customColor={colors.blue}
            variant="filled"
            size="tiny"
          >
            Receive
          </Button>
        </Link>
      </Box>
    ) : (
      "Quick infos"
    );

  return (
    <Widget title={title} grow position="relative">
      <Absolute top={30} right={10}>
        <Tooltip title="Account settings">
          <SettingsLink
            to={`${location.pathname}/accounts/details/${account.id}/overview`}
            className="content-header-button"
          >
            <FaWrench />
          </SettingsLink>
        </Tooltip>
      </Absolute>
      <SoftCard grow flow={20} style={{ padding: 0 }}>
        <Box horizontal flexWrap="wrap">
          <InfoSquare>
            <Label align="center" horizontal flow={5}>
              {icon}
              <span>
                {displayName}
                {` #${account.index}`}
              </span>
            </Label>
            <Text header select noWrap>
              {account.name}
            </Text>
          </InfoSquare>
          <InfoSquare>
            <Label align="center" horizontal flow={5}>
              <FaCoins />
              <span>Balance</span>
            </Label>
            <Text header select noWrap>
              <CurrencyAccountValue account={account} value={account.balance} />
              <Text small color={colors.textLight}>
                <CounterValue
                  value={account.balance}
                  fromAccount={account}
                  renderNA={
                    account.account_type === "ERC20" ? (
                      <Text>
                        <Trans i18nKey="accountView:erc20NoCountervalue" />
                      </Text>
                    ) : null
                  }
                />
              </Text>
            </Text>
          </InfoSquare>
          <InfoSquare>
            <Label align="center" horizontal flow={5}>
              <FaTicketAlt />
              <span>Status</span>
            </Label>
            <div>
              <EntityStatus
                size="big"
                status={account.status}
                request={account.last_request}
              />
            </div>
          </InfoSquare>
          {account.contract_address && (
            <>
              <InfoSquare>
                <Label>Smart contract address</Label>
                <Box horizontal flow={20} align="center">
                  <Copy text={account.contract_address} />
                </Box>
              </InfoSquare>
              {account.parent && (
                <InfoSquare>
                  <Label>Parent Ethereum account</Label>
                  <Link to={`${account.parent}`}>
                    <Button
                      IconLeft={FaLink}
                      customColor={colors.text}
                      variant="filled"
                      size="tiny"
                    >
                      <span style={{ marginLeft: 5 }}>
                        Go to parent account
                      </span>
                    </Button>
                  </Link>
                </InfoSquare>
              )}
            </>
          )}
        </Box>
      </SoftCard>
    </Widget>
  );
}

const SettingsLink = styled(Link)`
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${colors.mediumGrey};

  &:hover {
    color: ${colors.shark};
  }
`;

const InfoSquare = styled(Box).attrs({
  mr: 50,
  mt: 20,
  mb: 20,
  ml: 20,
})``;

function getIcon(account: Account) {
  const token =
    account.account_type === "ERC20"
      ? getERC20TokenByContractAddress(account.contract_address)
      : null;
  const currency =
    account.account_type === "ERC20"
      ? null
      : getCryptoCurrencyById(account.currency);
  return (
    <AccountIcon
      currencyId={currency ? currency.id : undefined}
      token={token}
    />
  );
}

function getDisplayName(account: Account) {
  if (account.account_type === "ERC20") {
    const token = getERC20TokenByContractAddress(account.contract_address);
    if (!token) return "Unknown token";
    return token.name;
  }
  const currency = getCryptoCurrencyById(account.currency);
  if (!currency) return "Unknown currency";
  return currency.name;
}

export default AccountQuickInfoWidget;
