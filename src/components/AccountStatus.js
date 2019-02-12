// @flow
import { PureComponent } from "react";
import { translate } from "react-i18next";
import type { Translate, Account } from "data/types";

type Props = {
  t: Translate,
  account: Account
};
class AccountStatus extends PureComponent<Props> {
  render() {
    const { account, t } = this.props;
    const translation = t(`accountStatus:${account.status}`);
    if (translation !== `accountStatus:${account.status}`) {
      // It is translated
      return translation;
    }
    return account.status;
  }
}

export default translate()(AccountStatus);
