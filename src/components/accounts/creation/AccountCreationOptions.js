// @flow

import { translate } from "react-i18next";
import React, { Fragment, PureComponent } from "react";
import { withStyles } from "@material-ui/core/styles";

import InputField from "components/InputField";
import ModalSubTitle from "components/operations/creation/ModalSubTitle";
import { getCryptoCurrencyIcon } from "utils/cryptoCurrencies";

import type { Translate, Account } from "data/types";
import type {
  State as AccountCreationState,
  UpdateState as UpdateAccountCreationState
} from "redux/modules/account-creation";

import ERC20RenderName from "./ERC20RenderName";

const inputProps = {
  maxLength: 19,
  onlyAscii: true
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

  render() {
    const {
      t,
      accountCreationState,
      updateAccountCreationState,
      allAccounts
    } = this.props;
    const { currency } = accountCreationState;

    if (accountCreationState.erc20token) {
      return (
        <ERC20RenderName
          accountCreationState={accountCreationState}
          allAccounts={allAccounts}
          updateAccountCreationState={updateAccountCreationState}
        />
      );
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
