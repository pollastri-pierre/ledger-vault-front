// @flow

import React, { PureComponent, Fragment } from "react";
import { Trans, translate } from "react-i18next";
import { withStyles } from "@material-ui/core/styles";
import Radio from "@material-ui/core/Radio";

import type {
  State as AccountCreationState,
  UpdateState as UpdateAccountCreationState,
  ParentAccount
} from "redux/modules/account-creation";

import type { Account, ERC20Token } from "data/types";

import SelectCurrency from "components/SelectCurrency";
import SelectAccount from "components/SelectAccount";
import InfoBox from "components/InfoBox";
import type { Item as SelectCurrencyItem } from "components/SelectCurrency";
import ModalSubTitle from "components/operations/creation/ModalSubTitle";
import { isERC20Token } from "utils/cryptoCurrencies";
import HelpLink from "components/HelpLink";
import ExternalLink from "components/icons/ExternalLink";
import colors from "shared/colors";

const styles = {
  topMarged: {
    marginTop: 20
  },
  radioContainer: {
    fontSize: 12,
    display: "flex",
    alignItems: "flex-start",
    cursor: "pointer"
  },
  radioContent: {
    marginTop: 15,
    marginBottom: 10
  },
  parentAccountSelectContainer: {
    marginTop: 10
  }
};

const findParentAccountInAccounts = (
  parentAccount: ?ParentAccount,
  availableParentAccounts: Account[]
) =>
  availableParentAccounts.find(
    a => parentAccount && parentAccount.id && a.id === parentAccount.id
  ) || null;

const getAvailableParentsAccounts = (
  allAccounts: Account[],
  erc20token: ?ERC20Token
) => {
  if (!erc20token) return [];
  const parentsIdsOfSameTokenAccounts = allAccounts
    .filter(
      a =>
        a.account_type === "ERC20" &&
        // $FlowFixMe flow failed to see that we are sure that erc20token is not null nor undefined
        a.contract_address === erc20token.contract_address
    )
    .map(a => a.parent_id);
  return allAccounts.filter(
    a =>
      a.status !== "PENDING" &&
      parentsIdsOfSameTokenAccounts.indexOf(a.id) === -1
  );
};

type Props = {
  accountCreationState: AccountCreationState,
  updateAccountCreationState: UpdateAccountCreationState,
  allAccounts: Account[],

  classes: { [_: $Keys<typeof styles>]: string },
  t: string => string
};

class AccountCreationCurrencies extends PureComponent<Props> {
  handleChooseParentAccount = (parentAccount: ?Account) => {
    this.props.updateAccountCreationState(() => ({
      parent_account: parentAccount ? { id: parentAccount.id } : null
    }));
  };

  handleChange = (item: ?SelectCurrencyItem) => {
    const { updateAccountCreationState, allAccounts } = this.props;
    const patch = {};
    if (!item) {
      Object.assign(patch, {
        currency: null,
        erc20token: null,
        parent_account: null
      });
    } else if (item.type === "currency") {
      Object.assign(patch, {
        currency: item.value,
        erc20token: null,
        currentTab: 1,
        parent_account: null
      });
    } else {
      const erc20token = item.value;
      const availableParentAccounts = getAvailableParentsAccounts(
        allAccounts,
        erc20token
      );

      Object.assign(patch, {
        currency: null,
        erc20token,
        parent_account: availableParentAccounts.length
          ? { id: availableParentAccounts[0].id }
          : null
      });
    }
    updateAccountCreationState(() => patch);
  };

  render() {
    const { accountCreationState, allAccounts, classes, t } = this.props;

    const currencyOrToken =
      accountCreationState.currency || accountCreationState.erc20token || null;

    const displayERC20Box = isERC20Token(currencyOrToken);

    const availableParentAccounts = getAvailableParentsAccounts(
      allAccounts,
      accountCreationState.erc20token
    );

    const parentAccount = findParentAccountInAccounts(
      accountCreationState.parent_account,
      allAccounts
    );

    return (
      <Fragment>
        <ModalSubTitle noPadding>
          <Trans i18nKey="newAccount:currency.label" />
        </ModalSubTitle>
        <SelectCurrency
          autoFocus
          openMenuOnFocus={!currencyOrToken}
          placeholder={t("newAccount:currency.placeholder")}
          value={currencyOrToken}
          onChange={this.handleChange}
        />
        {displayERC20Box && (
          <div className={classes.topMarged}>
            {availableParentAccounts.length > 0 ? (
              <EthAccountsRadio
                accounts={availableParentAccounts}
                account={parentAccount}
                onChange={this.handleChooseParentAccount}
                classes={classes}
              />
            ) : (
              <InfoBox type="info">
                <Trans i18nKey="newAccount:erc20.infoNewAccount" />{" "}
                <HelpLink>
                  <ExternalLink color={colors.black} size={11} />
                </HelpLink>
              </InfoBox>
            )}
          </div>
        )}
      </Fragment>
    );
  }
}

function EthAccountsRadio({
  onChange,
  account,
  accounts,
  classes
}: {
  accounts: Account[],
  account: ?Account,
  onChange: (?Account) => void,
  classes: { [_: $Keys<typeof styles>]: string }
}) {
  const onChooseNull = () => onChange(null);
  const selectFirstIfNotSet = () => {
    if (!account) {
      onChange(accounts[0]);
    }
  };

  return (
    <Fragment>
      <div className={classes.radioContainer} onClick={selectFirstIfNotSet}>
        <Radio color="primary" checked={account !== null} />
        <div className={classes.radioContent}>
          <Trans i18nKey="newAccount:erc20.selectExisting" />
          <div className={classes.parentAccountSelectContainer}>
            <SelectAccount
              accounts={accounts}
              value={account || accounts[0]}
              onChange={onChange}
            />
          </div>
        </div>
      </div>
      <div className={classes.radioContainer} onClick={onChooseNull}>
        <Radio color="primary" checked={account === null} />
        <div className={classes.radioContent}>
          <Trans i18nKey="newAccount:erc20.createNew" />
        </div>
      </div>
    </Fragment>
  );
}

export default withStyles(styles)(translate()(AccountCreationCurrencies));
