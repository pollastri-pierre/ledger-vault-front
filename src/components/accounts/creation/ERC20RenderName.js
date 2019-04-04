// @flow
import React, { PureComponent, Fragment } from "react";
import { translate } from "react-i18next";
import { withStyles } from "@material-ui/core/styles";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";

import InputField from "components/InputField";
import AccountSummary from "components/AccountSummary";
import ModalSubTitle from "components/operations/creation/ModalSubTitle";
import InfoBox from "components/InfoBox";
import Text from "components/Text";
import ERC20TokenIcon from "components/icons/ERC20Token";

import { getCryptoCurrencyIcon } from "utils/cryptoCurrencies";

import type { Translate, Account } from "data/types";
import type {
  State as AccountCreationState,
  UpdateState as UpdateAccountCreationState,
  ParentAccount
} from "redux/modules/account-creation";

type Props = {
  t: Translate,
  allAccounts: Account[],
  accountCreationState: AccountCreationState,
  updateAccountCreationState: UpdateAccountCreationState,
  classes: { [_: $Keys<typeof styles>]: string }
};
type State = {
  accountName: string,
  parentName: string,
  matchingNamesWarning: boolean
};

const erc20TokenIcon = <ERC20TokenIcon size={15} />;

const ethereumCurrency = getCryptoCurrencyById("ethereum");
const ropstenCurrency = getCryptoCurrencyById("ethereum_ropsten");
const EthereumCurIcon = getCryptoCurrencyIcon(ethereumCurrency);
const RopstenCurIcon = getCryptoCurrencyIcon(ropstenCurrency);
const ethereumCurIcon = EthereumCurIcon ? (
  <EthereumCurIcon size={15} color={ethereumCurrency.color} />
) : null;
const ropstenCurIcon = RopstenCurIcon ? (
  <RopstenCurIcon size={15} color={ropstenCurrency.color} />
) : null;

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

class ERC20RenderName extends PureComponent<Props, State> {
  constructor(props) {
    super(props);
    const { parent_account, name } = props.accountCreationState;
    const parentAccountName = getParentAccountName(parent_account);

    this.state = {
      accountName: name || "",
      parentName: parentAccountName || "",
      matchingNamesWarning: false
    };
  }

  componentDidMount() {
    this.checkMatchingNameWarning();
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState.accountName !== this.state.accountName ||
      prevState.parentName !== this.state.parentName
    ) {
      this.checkMatchingNameWarning();
    }
  }

  checkMatchingNameWarning() {
    const { accountName, parentName } = this.state;
    if (accountName === parentName && accountName !== "") {
      this.setState({ matchingNamesWarning: true });
    } else {
      this.setState({ matchingNamesWarning: false });
    }
  }

  handleChangeName = (name: string) => {
    const { updateAccountCreationState } = this.props;
    updateAccountCreationState(() => ({ name }));
    this.setState({ accountName: name });
  };

  handleChangeParentAccountName = (name: string) => {
    const { updateAccountCreationState } = this.props;
    updateAccountCreationState(() => ({ parent_account: { name } }));
    this.setState({ parentName: name });
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

  render() {
    const { t, accountCreationState, classes } = this.props;
    const { erc20token } = accountCreationState;
    const { matchingNamesWarning } = this.state;
    if (!erc20token) return null;
    const { parent_account } = accountCreationState;
    const parentCurIcon =
      erc20token.blockchain_name === "foundation"
        ? ethereumCurIcon
        : ropstenCurIcon;

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
              renderLeft={parentCurIcon}
              {...inputProps}
            />
            {matchingNamesWarning && (
              <InfoBox withIcon type="warning" className={classes.infoBox}>
                <Text>{t("newAccount:erc20.matchingNameWarning")}</Text>
              </InfoBox>
            )}
          </Fragment>
        )}
      </Fragment>
    );
  }
}
const styles = {
  infoBox: {
    marginTop: 20
  }
};
export default withStyles(styles)(translate()(ERC20RenderName));
