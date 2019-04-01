// @flow
import React, { PureComponent, Fragment } from "react";
import { translate } from "react-i18next";
import { withStyles } from "@material-ui/core/styles";

import InputField from "components/InputField";
import AccountSummary from "components/AccountSummary";
import ModalSubTitle from "components/transactions/creation/ModalSubTitle";
import InfoBox from "components/base/InfoBox";
import Text from "components/base/Text";
import ERC20TokenIcon from "components/icons/ERC20Token";

import {
  getCryptoCurrencyById,
  getCryptoCurrencyIcon,
} from "utils/cryptoCurrencies";

import type { Translate } from "data/types";
import type { AccountCreationStepProps, ParentAccount } from "../types";

type Props = AccountCreationStepProps & {
  t: Translate,
  classes: { [_: $Keys<typeof styles>]: string },
};

type State = {
  accountName: string,
  parentName: string,
  matchingNamesWarning: boolean,
};

const erc20TokenIcon = <ERC20TokenIcon size={15} />;

const ethereumCurrency = getCryptoCurrencyById("ethereum");
const ropstenCurrency = getCryptoCurrencyById("ethereum_testnet");
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
  onlyAscii: true,
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
  constructor(props: Props) {
    super(props);
    const { parentAccount, name } = props.payload;
    const parentAccountName = getParentAccountName(parentAccount);

    this.state = {
      accountName: name || "",
      parentName: parentAccountName || "",
      matchingNamesWarning: false,
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
    const { updatePayload } = this.props;
    updatePayload({ name });
    this.setState({ accountName: name });
  };

  handleChangeParentAccountName = (name: string) => {
    const { updatePayload } = this.props;
    updatePayload({ parentAccount: { name } });
    this.setState({ parentName: name });
  };

  renderParentAccountSummary = () => {
    const { payload, allAccounts } = this.props;
    const { parentAccount } = payload;
    if (!parentAccount || !parentAccount.id) return null;
    const account = allAccounts.find(
      acc => parentAccount.id && acc.id === parentAccount.id,
    );
    if (!account) return null;
    return <AccountSummary account={account} />;
  };

  render() {
    const { t, payload, classes } = this.props;
    const { erc20token } = payload;
    const { matchingNamesWarning } = this.state;
    if (!erc20token) return null;
    const { parentAccount } = payload;
    const parentCurIcon =
      erc20token.blockchain_name === "foundation"
        ? ethereumCurIcon
        : ropstenCurIcon;

    const parentAccountName = getParentAccountName(parentAccount);

    return (
      <Fragment>
        <ModalSubTitle noPadding>{t("newAccount:options.name")}</ModalSubTitle>
        <InputField
          dataTest="account_childname"
          value={payload.name}
          autoFocus
          onChange={this.handleChangeName}
          placeholder={t("newAccount:options.acc_name_placeholder")}
          renderLeft={erc20TokenIcon}
          {...inputProps}
        />
        {parentAccount && parentAccount.id ? (
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
              dataTest="account_parentname"
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
    marginTop: 20,
  },
};
export default withStyles(styles)(translate()(ERC20RenderName));
