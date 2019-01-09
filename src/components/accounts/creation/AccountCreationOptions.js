//@flow
import { translate } from "react-i18next";
import React, { PureComponent } from "react";
import type { Translate } from "data/types";
import type { CryptoCurrency } from "@ledgerhq/live-common/lib/types";
import { withStyles } from "@material-ui/core/styles";
import { getCryptoCurrencyIcon } from "@ledgerhq/live-common/lib/react";
import InputField from "components/InputField";
import ModalSubTitle from "components/operations/creation/ModalSubTitle";

// NOTE: didn't delete for future wireframes that will need it
const styles = {};

type Props = {
  currency: CryptoCurrency,
  name: string,
  changeName: Function,
  t: Translate,
  classes: { [_: $Keys<typeof styles>]: string }
};
class AccountCreationOptions extends PureComponent<Props> {
  changeAccountName = (name: string) => {
    const { changeName } = this.props;
    changeName(name);
  };
  render() {
    const { name, currency, t } = this.props;
    const AccountCurIcon = getCryptoCurrencyIcon(currency);
    return (
      <div>
        <ModalSubTitle noPadding>{t("newAccount:options.name")}</ModalSubTitle>
        <InputField
          autoFocus
          renderLeft={
            AccountCurIcon && (
              <div style={{ color: currency.color }}>
                <AccountCurIcon size={15} />
              </div>
            )
          }
          value={name}
          placeholder={t("newAccount:options.acc_name_placeholder")}
          onChange={this.changeAccountName}
        />
      </div>
    );
  }
}

export default withStyles(styles)(translate()(AccountCreationOptions));
