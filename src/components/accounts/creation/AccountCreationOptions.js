//@flow
import { translate } from "react-i18next";
import React, { Fragment, PureComponent } from "react";
import { withStyles } from "@material-ui/core/styles";
import { getCryptoCurrencyIcon } from "@ledgerhq/live-common/lib/react";

import InputField from "components/InputField";
import ModalSubTitle from "components/operations/creation/ModalSubTitle";
import { getCryptoCurrencyById } from "utils/cryptoCurrencies";
import ERC20TokenIcon from "components/icons/ERC20Token";

import type { Translate } from "data/types";
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

  renderERC20Token = () => {
    const { t, accountCreationState } = this.props;
    const { erc20token } = accountCreationState;
    if (!erc20token) return null;

    const parentAccountName = getParentAccountName(
      accountCreationState.parent_account
    );

    return (
      <Fragment>
        <ModalSubTitle noPadding>{t("newAccount:options.name")}</ModalSubTitle>
        <InputField
          value={accountCreationState.name}
          autoFocus
          onChange={this.handleChangeName}
          placeholder={t("newAccount:options.acc_name_placeholder")}
          fullWidth
          renderLeft={erc20TokenIcon}
        />
        <ModalSubTitle noPadding style={{ marginTop: 30 }}>
          {t("newAccount:options.parentName")}
        </ModalSubTitle>
        <InputField
          value={parentAccountName}
          onChange={this.handleChangeParentAccountName}
          placeholder={t("newAccount:options.acc_name_placeholder")}
          fullWidth
          renderLeft={ethereumCurIcon}
        />
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
