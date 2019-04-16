// @flow

import React, { Component, Fragment } from "react";
import styled from "styled-components";
import { Trans } from "react-i18next";
import { Link } from "react-router-dom";

import { isAccountOutdated } from "utils/accounts";
import { getERC20TokenByContractAddress } from "utils/cryptoCurrencies";
import colors from "shared/colors";

import Card from "components/base/Card";
import Absolute from "components/base/Absolute";
import Box from "components/base/Box";
import Text from "components/base/Text";
import DateFormat from "components/DateFormat";
import CurrencyIndex from "components/CurrencyIndex";
import BlurDialog from "components/BlurDialog";
import MemberRow from "components/MemberRow";
import AccountSettings from "components/AccountSettings";
import ModalRoute from "components/ModalRoute";
import { FaWrench } from "react-icons/fa";
import type { Account, User } from "data/types";
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
  me: User,
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

type State = {
  modalMembersOpen: boolean,
};

class AccountQuickInfo extends Component<Props, State> {
  state: State = {
    modalMembersOpen: false,
  };

  toggleModalMembers = () => {
    const { modalMembersOpen } = this.state;
    this.setState({ modalMembersOpen: !modalMembersOpen });
  };

  renderMembersLink = () => {
    const {
      account,
      account: { members },
    } = this.props;
    return account.status === "VIEW_ONLY" ? (
      <span>-</span>
    ) : (
      <Fragment>
        <span>{members.length}</span>
        <span onClick={this.toggleModalMembers}>
          <Trans i18nKey="accountView:members_modal.toggle" />
        </span>
      </Fragment>
    );
  };

  renderListMember = () => {
    const {
      account: { members },
    } = this.props;
    return (
      <div>
        <div>
          <Trans i18nKey="accountView:members_modal.title" />
        </div>
        <div>
          {members.map(m => (
            <MemberRow edidable={false} member={m} key={m.pub_key} />
          ))}
        </div>
      </div>
    );
  };

  // TODO: type this labyrinth
  AccountSettings = (props: *) => (
    <AccountSettings account={this.props.account} {...props} />
  );

  render() {
    const { account, me } = this.props;
    const { modalMembersOpen } = this.state;

    const isERC20 = account.account_type === "ERC20";
    const token = isERC20
      ? getERC20TokenByContractAddress(account.contract_address)
      : null;

    return (
      <Fragment>
        <ModalRoute
          path="*/account-settings"
          component={this.AccountSettings}
        />

        <BlurDialog open={modalMembersOpen} onClose={this.toggleModalMembers}>
          {this.renderListMember()}
        </BlurDialog>

        <Card title={<AccountTitle account={account} />}>
          {!isERC20 && (
            <Absolute top={0} right={0}>
              <SettingsLink
                title="Settings"
                to={`${location.pathname}/account-settings`}
                className="content-header-button"
              >
                <FaWrench />
              </SettingsLink>
            </Absolute>
          )}
          <div>
            <div>
              <Row
                label={<Trans i18nKey="accountView:summary.name" />}
                value={account.name}
              />
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
              <Row
                label={<Trans i18nKey="accountView:summary.unit" />}
                value={
                  isERC20
                    ? token && token.ticker
                    : account.settings.currency_unit.code
                }
              />
              <Row
                label={<Trans i18nKey="accountView:summary.date" />}
                value={<DateFormat date={account.created_on} />}
              />
              {account.account_type === "ERC20" && account.parent_id && (
                <Fragment>
                  <Row
                    label={
                      <Trans i18nKey="accountView:summary.token_address" />
                    }
                    value={account.contract_address}
                  />
                  <Row
                    label={
                      <Trans i18nKey="accountView:summary.parent_account" />
                    }
                    value={<Link to={`${account.parent_id}`}>ETH account</Link>}
                  />
                </Fragment>
              )}
            </div>
            <div>
              <AccountWarning account={account} me={me} />
            </div>
          </div>
        </Card>
      </Fragment>
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
