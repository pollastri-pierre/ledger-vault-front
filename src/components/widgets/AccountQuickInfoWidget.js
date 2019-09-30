// @flow

import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  FaCoins,
  FaWrench,
  FaTicketAlt,
  FaLink,
  FaCheck,
} from "react-icons/fa";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
import Tooltip from "@material-ui/core/Tooltip";

import EntityStatus from "components/EntityStatus";
import CounterValue from "components/CounterValue";
import ApproverRole from "components/ApproverRole";
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
import SyncButton from "components/SyncButton";
import Text from "components/base/Text";
import { SoftCard } from "components/base/Card";
import AccountIcon from "components/AccountIcon";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import { getERC20TokenByContractAddress } from "utils/cryptoCurrencies";
import { isAccountSpendable } from "utils/transactions";
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
          <Button small type="filled" disabled={!isAccountSpendable(account)}>
            <Box horizontal flow={5} align="center">
              <IconSend size={10} />
              <Text i18nKey="accountView:sendButton" />
            </Box>
          </Button>
        </Link>
        <Link to={`${account.id}/receive/${account.id}`}>
          <Button small type="filled">
            <Box horizontal flow={5} align="center">
              <IconReceive size={10} />
              <Text i18nKey="accountView:receiveButton" />
            </Box>
          </Button>
        </Link>
      </Box>
    ) : null;

  const widget = (
    <Widget
      title={title}
      titleRight={<SyncButton account={account} />}
      grow
      position="relative"
    >
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
          {account.status !== "PENDING" && (
            <InfoSquare>
              <Label align="center" horizontal flow={5}>
                <FaCoins />
                <span>Balance</span>
              </Label>
              <Text header select noWrap>
                <CurrencyAccountValue
                  account={account}
                  value={account.balance}
                />
                <Text small color={colors.textLight}>
                  <CounterValue
                    value={account.balance}
                    fromAccount={account}
                    renderNA={
                      account.account_type === "Erc20" ? (
                        <ERC20CountervalueUnavailable account={account} />
                      ) : null
                    }
                  />
                </Text>
              </Text>
            </InfoSquare>
          )}
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
          {me.role === "OPERATOR" && (
            <InfoSquare>
              <Label align="center" horizontal flow={5}>
                <FaCheck />
                <Text i18nKey="accountView:permission" />
              </Label>
              <div>
                <ApproverRole account={account} />
              </div>
            </InfoSquare>
          )}
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
                  <Link to={account.parent.toString()}>
                    <Box horizontal flow={5} align="center" justify="center">
                      <FaLink />
                      <Text i18nKey="accountView:navigateParent" />
                    </Box>
                  </Link>
                </InfoSquare>
              )}
            </>
          )}
        </Box>
      </SoftCard>
    </Widget>
  );

  return (
    <div style={{ position: "relative" }}>
      {widget}
      <Absolute top={50} right={10}>
        <Tooltip title="Account settings" placement="left">
          <Link
            to={`${location.pathname}/accounts/details/${account.id}/overview`}
          >
            <Button>
              <FaWrench />
            </Button>
          </Link>
        </Tooltip>
      </Absolute>
    </div>
  );
}

const InfoSquare = styled(Box).attrs({
  mr: 50,
  mt: 20,
  mb: 20,
  ml: 20,
})``;

function getIcon(account: Account) {
  const token =
    account.account_type === "Erc20"
      ? getERC20TokenByContractAddress(account.contract_address)
      : null;
  const currency =
    account.account_type === "Erc20"
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
  if (account.account_type === "Erc20") {
    const token = getERC20TokenByContractAddress(account.contract_address);
    if (!token) return "Unknown token";
    return token.name;
  }
  const currency = getCryptoCurrencyById(account.currency);
  if (!currency) return "Unknown currency";
  return currency.name;
}

const ERC20CountervalueUnavailable = ({ account }: { account: Account }) => {
  const token = getERC20TokenByContractAddress(account.contract_address);
  if (!token) return null;
  if (token.disable_countervalue) {
    return <Text i18nKey="accountView:erc20DisabledCountervalue" />;
  }
  return <Text i18nKey="accountView:erc20NoCountervalue" />;
};

export default AccountQuickInfoWidget;
