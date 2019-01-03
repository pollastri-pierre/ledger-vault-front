//@flow

import React, { PureComponent, Fragment } from "react";
import { Trans, translate } from "react-i18next";
import { withStyles } from "@material-ui/core/styles";

import type {
  State as AccountCreationState,
  UpdateState as UpdateAccountCreationState
} from "redux/modules/account-creation";
import SelectCurrency from "components/SelectCurrency";
import type { Item as SelectCurrencyItem } from "components/SelectCurrency";
import ModalSubTitle from "components/operations/creation/ModalSubTitle";

const styles = {};

type Props = {
  accountCreationState: AccountCreationState,
  updateAccountCreationState: UpdateAccountCreationState,

  classes: { [_: $Keys<typeof styles>]: string },
  t: string => string
};

class AccountCreationCurrencies extends PureComponent<Props> {
  handleChange = (item: ?SelectCurrencyItem) => {
    const { updateAccountCreationState } = this.props;
    const patch = {};
    if (!item) {
      Object.assign(patch, { currency: null, erc20token: null });
    } else if (item.type === "currency") {
      Object.assign(patch, {
        currency: item.value,
        erc20token: null,
        currentTab: 1
      });
    } else {
      Object.assign(patch, { currency: null, erc20token: item.value });
    }
    updateAccountCreationState(() => patch);
  };

  render() {
    const { accountCreationState, t } = this.props;

    const currencyOrToken =
      accountCreationState.currency || accountCreationState.erc20token || null;

    return (
      <Fragment>
        <ModalSubTitle noPadding>
          <Trans i18nKey="newAccount:currency.enterCrypto" />
        </ModalSubTitle>
        <SelectCurrency
          placeholder={t("newAccount:currency.enterCrypto")}
          value={currencyOrToken}
          onChange={this.handleChange}
        />
      </Fragment>
    );
  }
}
export default withStyles(styles)(translate()(AccountCreationCurrencies));
