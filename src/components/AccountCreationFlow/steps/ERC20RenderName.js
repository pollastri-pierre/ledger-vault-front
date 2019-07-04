// @flow
import React, { PureComponent } from "react";
import { withTranslation } from "react-i18next";
import { withStyles } from "@material-ui/core/styles";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";

import AccountSummary from "components/AccountSummary";
import InfoBox from "components/base/InfoBox";
import Text from "components/base/Text";
import { InputText, Label } from "components/base/form";
import ERC20TokenIcon from "components/icons/ERC20Token";

import { getCryptoCurrencyIcon } from "utils/cryptoCurrencies";

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

const ethereumCurrency = getCryptoCurrencyById("ethereum");
const ropstenCurrency = getCryptoCurrencyById("ethereum_ropsten");
const EthereumCurIconSrc = getCryptoCurrencyIcon(ethereumCurrency);
const RopstenCurIconSrc = getCryptoCurrencyIcon(ropstenCurrency);
const EthereumCurIcon = EthereumCurIconSrc
  ? () => <EthereumCurIconSrc size={15} color={ethereumCurrency.color} />
  : null;
const RopstenCurIcon = RopstenCurIconSrc
  ? () => <RopstenCurIconSrc size={15} color={ropstenCurrency.color} />
  : null;

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
    const accountElement = allAccounts.edges.find(
      el => parentAccount.id && el.node.id === parentAccount.id,
    );
    const account = accountElement ? accountElement.node : null;
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
        ? EthereumCurIcon
        : RopstenCurIcon;

    const parentAccountName = getParentAccountName(parentAccount);

    return (
      <>
        <Label>{t("newAccount:options.name")}</Label>
        <InputText
          value={payload.name}
          data-test="account_childname"
          autoFocus
          onChange={this.handleChangeName}
          placeholder={t("newAccount:options.acc_name_placeholder")}
          IconLeft={() => <ERC20TokenIcon token={erc20token} size={16} />}
          {...inputProps}
        />
        {parentAccount && parentAccount.id ? (
          <>
            <Label mt={30}>{t("newAccount:options.selectedParent")}</Label>
            {this.renderParentAccountSummary()}
          </>
        ) : (
          <>
            <Label mt={30}>{t("newAccount:options.parentName")}</Label>
            <InputText
              value={parentAccountName}
              data-test="account_parentname"
              onChange={this.handleChangeParentAccountName}
              placeholder={t("newAccount:options.acc_name_placeholder")}
              IconLeft={parentCurIcon}
              {...inputProps}
            />
            {matchingNamesWarning && (
              <InfoBox withIcon type="warning" className={classes.infoBox}>
                <Text>{t("newAccount:erc20.matchingNameWarning")}</Text>
              </InfoBox>
            )}
          </>
        )}
      </>
    );
  }
}

const styles = {
  infoBox: {
    marginTop: 20,
  },
};
export default withStyles(styles)(withTranslation()(ERC20RenderName));
