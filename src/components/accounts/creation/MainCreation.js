// @flow
import React, { Component } from "react";
import _ from "lodash";
import connectData from "restlay/connectData";
import { translate } from "react-i18next";
import type { Translate, Account } from "data/types";
import { withStyles } from "@material-ui/core/styles";
import modals from "shared/modals";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { isNotSupportedCoin } from "utils/cryptoCurrencies";
import { ModalClose } from "components/base/Modal";

import type {
  State as AccountCreationState,
  UpdateState as UpdateAccountCreationState
} from "redux/modules/account-creation";

import { DialogButton } from "../..";
import AccountCreationConfirmation from "./AccountCreationConfirmation";
import AccountCreationSecurity from "./AccountCreationSecurity";
import AccountCreationOptions from "./AccountCreationOptions";
import AccountCreationCurrencies from "./AccountCreationCurrencies";

const styles = {
  base: {
    ...modals.base,
    width: 500,
    height: 615
  }
};

const contentComponents = [
  AccountCreationCurrencies,
  AccountCreationOptions,
  AccountCreationSecurity,
  AccountCreationConfirmation
];

type Props = {
  accountCreationState: AccountCreationState,
  updateAccountCreationState: UpdateAccountCreationState,
  allAccounts: Account[],
  t: Translate,

  // TODO: legacy stuff
  switchInternalModal: Function,
  classes: Object,
  close: Function
};

class MainCreation extends Component<Props> {
  handleChange = (event, value) => {
    this.changeTabAccount(value);
  };

  changeTabAccount = (index: number) => {
    const { updateAccountCreationState } = this.props;
    updateAccountCreationState(() => ({ currentTab: index }));
  };

  nextTab = () => {
    this.changeTabAccount(
      parseInt(this.props.accountCreationState.currentTab, 10) + 1
    );
  };

  render() {
    const {
      accountCreationState,
      updateAccountCreationState,
      allAccounts,
      close,
      t,
      classes,
      switchInternalModal
    } = this.props;

    const { currentTab } = accountCreationState;

    let isNextDisabled = false;
    const parentName =
      accountCreationState.parent_account &&
      "name" in accountCreationState.parent_account;
    switch (currentTab) {
      case 0:
        isNextDisabled =
          (_.isNull(accountCreationState.erc20token) &&
            _.isNull(accountCreationState.currency)) ||
          (accountCreationState.currency &&
            isNotSupportedCoin(accountCreationState.currency));
        break;
      case 1:
        isNextDisabled = accountCreationState.erc20token
          ? accountCreationState.name === "" ||
            (parentName &&
              accountCreationState.name ===
                // $FlowFixMe
                accountCreationState.parent_account.name) ||
            (!accountCreationState.parent_account ||
              (!accountCreationState.parent_account.id &&
                !("name" in accountCreationState.parent_account)))
          : accountCreationState.name === "";
        break;
      case 2:
        isNextDisabled =
          accountCreationState.approvers.length === 0 ||
          accountCreationState.quorum === 0 ||
          accountCreationState.quorum > accountCreationState.approvers.length;
        break;
      default:
        isNextDisabled = true;
    }

    const save = () => {
      switchInternalModal("device");
    };

    const contentProps = {
      accountCreationState,
      updateAccountCreationState,
      allAccounts,
      switchInternalModal
    };

    const ContentComponent = contentComponents[currentTab];

    return (
      <div className={classes.base}>
        <header>
          <h2>{t("newAccount:title")}</h2>
          <ModalClose onClick={close} />
          <Tabs
            onChange={this.handleChange}
            value={currentTab}
            indicatorColor="primary"
          >
            <Tab
              label={`1. ${t("newAccount:currency.tabTitle")}`}
              disableRipple
            />
            <Tab
              label={`2. ${t("newAccount:options.title")}`}
              disabled={
                _.isNull(accountCreationState.currency) &&
                _.isNull(accountCreationState.erc20token)
              }
              disableRipple
            />
            <Tab
              label={`3. ${t("newAccount:security.title")}`}
              disabled={accountCreationState.name === ""}
              disableRipple
            />
            <Tab
              label={`4. ${t("newAccount:confirmation.title")}`}
              disabled={
                accountCreationState.approvers.length === 0 ||
                accountCreationState.quorum === 0 ||
                accountCreationState.quorum >
                  accountCreationState.approvers.length
              }
              disableRipple
            />
          </Tabs>
        </header>
        <div className="content">
          {ContentComponent ? <ContentComponent {...contentProps} /> : null}
        </div>
        <div className="footer">
          {_.includes([0, 1, 2], currentTab) ? (
            <DialogButton
              highlight
              right
              disabled={isNextDisabled}
              onTouchTap={this.nextTab}
            >
              {!!accountCreationState.erc20token &&
              (!accountCreationState.parent_account ||
                !accountCreationState.parent_account.id) &&
              currentTab === 0
                ? t("accountCreation:continue_eth_creation")
                : t("common:continue")}
            </DialogButton>
          ) : (
            <DialogButton highlight right onTouchTap={save}>
              {t("common:done")}
            </DialogButton>
          )}
        </div>
      </div>
    );
  }
}

export default connectData(withStyles(styles)(translate()(MainCreation)));
