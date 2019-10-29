// @flow

import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { FaCoins, FaInfo, FaTicketAlt, FaLink, FaCheck } from "react-icons/fa";
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
import PageHeaderActions from "components/base/PageHeaderActions";
import { SoftCard } from "components/base/Card";
import AccountIcon from "components/AccountIcon";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import { getERC20TokenByContractAddress } from "utils/cryptoCurrencies";
import { isAccountSpendable } from "utils/transactions";
import Widget from "./Widget";

type Props = {
  account: Account,
};

const AccountQuickInfoWidget = (props: Props) => (
  <div style={{ position: "relative" }}>
    <AccountQuickInfoHeader {...props} />
    <WidgetContent {...props} />
    <DetailsLink {...props} />
  </div>
);

const AccountQuickInfoHeader = ({ account }: Props) => {
  const me = useMe();
  const isSendDisabled = !isAccountSpendable(account);
  const sendBtn = (
    <Button size="small" type="filled" disabled={isSendDisabled}>
      <Box horizontal flow={5} align="center">
        <IconSend size={10} />
        <Text i18nKey="accountView:sendButton" />
      </Box>
    </Button>
  );
  return (
    <PageHeaderActions title={account.name}>
      {me.role === "OPERATOR" ? (
        <Box horizontal flow={10}>
          {isSendDisabled ? (
            sendBtn
          ) : (
            <Link to={`${account.id}/send/${account.id}`}>{sendBtn}</Link>
          )}
          <Link to={`${account.id}/receive/${account.id}`}>
            <Button size="small" type="filled">
              <Box horizontal flow={5} align="center">
                <IconReceive size={10} />
                <Text i18nKey="accountView:receiveButton" />
              </Box>
            </Button>
          </Link>
          <SyncButton account={account} />
        </Box>
      ) : (
        <SyncButton account={account} />
      )}
    </PageHeaderActions>
  );
};

const WidgetContent = ({ account }: Props) => {
  const me = useMe();
  const icon = getIcon(account);
  const displayName = getDisplayName(account);
  return (
    <Widget grow position="relative">
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
            <Text size="header" selectable noWrap>
              {account.name}
            </Text>
          </InfoSquare>
          {account.status !== "PENDING" && (
            <InfoSquare>
              <Label align="center" horizontal flow={5}>
                <FaCoins />
                <span>Balance</span>
              </Label>
              <Text size="header" selectable noWrap>
                <CurrencyAccountValue
                  account={account}
                  value={account.balance}
                />
                <Text size="small" color={colors.textLight}>
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
};

const DetailsLink = ({ account }: Props) => (
  <Absolute top={60} right={10}>
    <Tooltip title="Account details" placement="left">
      <Link to={`${location.pathname}/accounts/details/${account.id}/overview`}>
        <Button>
          <FaInfo />
        </Button>
      </Link>
    </Tooltip>
  </Absolute>
);

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
