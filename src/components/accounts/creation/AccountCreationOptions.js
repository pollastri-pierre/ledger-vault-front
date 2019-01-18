// @flow

import { translate } from "react-i18next";
import React, { Fragment, PureComponent } from "react";
import { withStyles } from "@material-ui/core/styles";

import InputField from "components/InputField";
import AccountSummary from "components/AccountSummary";
import ModalSubTitle from "components/operations/creation/ModalSubTitle";
import {
  getCryptoCurrencyById,
  getCryptoCurrencyIcon
} from "utils/cryptoCurrencies";
import ERC20TokenIcon from "components/icons/ERC20Token";

import type { Translate, Account } from "data/types";
import type {
  State as AccountCreationState,
  UpdateState as UpdateAccountCreationState,
  ParentAccount
} from "redux/modules/account-creation";

const ethereumCurrency = getCryptoCurrencyById("ethereum");
const EthereumCurIcon = getCryptoCurrencyIcon(ethereumCurrency);
const ethereumCurIcon = EthereumCurIcon ? (
  <EthereumCurIcon size={15} color={ethereumCurrency.color} />
) : null;
const erc20TokenIcon = <ERC20TokenIcon size={15} />;

const inputProps = {
  maxLength: 19,
  onlyAscii: true
};

const getParentAccountName = (parentAccount: ?ParentAccount): string => {
  if (!parentAccount) return "";
  // TODO: handle parentAccount.id, by retrieving name inside list of
  // ethereum accounts
  if (!parentAccount.name) return "";
  // TODO: why is flow forcing to do this
  if (typeof parentAccount.name !== "string") return "";
  return parentAccount.name;
};

const styles = {
  title: {
    fontSize: 11,
    fontWeight: 600,
    textTransform: "uppercase",
    marginBottom: 20,
    display: "block"
  },
  relative: {
    position: "relative"
  }
};

type Props = {
  allAccounts: Account[],
  accountCreationState: AccountCreationState,
  updateAccountCreationState: UpdateAccountCreationState,

  classes: { [_: $Keys<typeof styles>]: string },
  t: Translate
};

class AccountCreationOptions extends PureComponent<Props> {
  handleChangeName = (name: string) => {
    const { updateAccountCreationState } = this.props;
    updateAccountCreationState(() => ({ name }));
  };

  handleChangeParentAccountName = (name: string) => {
    const { updateAccountCreationState } = this.props;
    updateAccountCreationState(() => ({ parent_account: { name } }));
  };

  renderParentAccountSummary = () => {
    const { accountCreationState, allAccounts } = this.props;
    const { parent_account } = accountCreationState;
    if (!parent_account || !parent_account.id) return null;
    const account = allAccounts.find(
      acc => parent_account.id && acc.id === parent_account.id
    );
    if (!account) return null;
    return <AccountSummary account={account} />;
  };

  renderERC20Token = () => {
    const { t, accountCreationState } = this.props;
    const { erc20token } = accountCreationState;
    if (!erc20token) return null;

    const { parent_account } = accountCreationState;

    const parentAccountName = getParentAccountName(parent_account);

    return (
      <Fragment>
        <ModalSubTitle noPadding>{t("newAccount:options.name")}</ModalSubTitle>
        <InputField
          value={accountCreationState.name}
          autoFocus
          onChange={this.handleChangeName}
          placeholder={t("newAccount:options.acc_name_placeholder")}
          renderLeft={erc20TokenIcon}
          {...inputProps}
        />
        {parent_account && parent_account.id ? (
          <Fragment>
            <ModalSubTitle noPadding style={{ marginTop: 30 }}>
              {t("newAccount:options.selectedParent")}
            </ModalSubTitle>
            {this.renderParentAccountSummary()}
          </Fragment>
        ) : (
          <Fragment>
            <ModalSubTitle noPadding style={{ marginTop: 30 }}>
              {t("newAccount:options.parentName")}
            </ModalSubTitle>
            <InputField
              value={parentAccountName}
              onChange={this.handleChangeParentAccountName}
              placeholder={t("newAccount:options.acc_name_placeholder")}
              renderLeft={ethereumCurIcon}
              {...inputProps}
            />
          </Fragment>
        )}
      </Fragment>
    );
  };

  render() {
    const { t, accountCreationState } = this.props;
    const { currency } = accountCreationState;

    if (accountCreationState.erc20token) {
      return this.renderERC20Token();
    }

    if (!currency) return null;

    const AccountCurIcon = getCryptoCurrencyIcon(currency);
    return (
      <Fragment>
        <ModalSubTitle noPadding>{t("newAccount:options.name")}</ModalSubTitle>
        <InputField
          value={accountCreationState.name}
          autoFocus
          onChange={this.handleChangeName}
          {...inputProps}
          placeholder={t("newAccount:options.acc_name_placeholder")}
          renderLeft={
            AccountCurIcon ? (
              <AccountCurIcon color={currency.color} size={15} />
            ) : null
          }
        />
      </Fragment>
    );
  }
}

export default withStyles(styles)(translate()(AccountCreationOptions));
