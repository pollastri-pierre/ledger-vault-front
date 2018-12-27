//@flow
import React, { Component } from "react";
import _ from "lodash";
import connectData from "restlay/connectData";
import AccountCreationCurrencies from "./AccountCreationCurrencies";
import { translate } from "react-i18next";
import AccountCreationOptions from "./AccountCreationOptions";
import AccountCreationSecurity from "./AccountCreationSecurity";
import AccountCreationConfirmation from "./AccountCreationConfirmation";
import { DialogButton } from "../../";
import type { Currency, Translate } from "data/types";
import { withStyles } from "@material-ui/core/styles";
import modals from "shared/modals";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

type Props = {
  changeAccountName: Function,
  selectCurrency: (cur: Currency) => void,
  onSelect: Function,
  t: Translate,
  switchInternalModal: Function,
  restlay: *,
  tabsIndex: number,
  account: *,
  classes: Object
};

const styles = {
  base: {
    ...modals.base,
    width: 450,
    height: 615
  }
};

class MainCreation extends Component<Props> {
  handleChange = (event, value) => {
    this.props.onSelect(value);
  };
  render() {
    const { props } = this;
    const {
      changeAccountName,
      account,
      selectCurrency,
      t,
      onSelect,
      tabsIndex,
      classes,
      switchInternalModal
    } = props;

    let isNextDisabled = false;

    switch (tabsIndex) {
      case 0:
        isNextDisabled = _.isNull(account.currency);
        break;
      case 1:
        isNextDisabled = account.name === "";
        break;
      case 2:
        isNextDisabled =
          account.approvers.length === 0 ||
          account.quorum === 0 ||
          account.quorum > account.approvers.length;
        break;
      default:
        isNextDisabled = true;
    }

    const save = () => {
      switchInternalModal("device");
    };

    return (
      <div className={classes.base}>
        <header>
          <h2>{t("newAccount:title")}</h2>
          <Tabs
            onChange={this.handleChange}
            value={tabsIndex}
            indicatorColor="primary"
          >
            <Tab label={`1. ${t("newAccount:currency")}`} disableRipple />
            <Tab
              label={`2. ${t("newAccount:options.title")}`}
              disabled={_.isNull(account.currency)}
              disableRipple
            />
            <Tab
              label={`3. ${t("newAccount:security.title")}`}
              disabled={account.name === ""}
              disableRipple
            />
            <Tab
              label={`4. ${t("newAccount:confirmation.title")}`}
              disabled={
                account.approvers.length === 0 ||
                account.quorum === 0 ||
                account.quorum > account.approvers.length
              }
              disableRipple
            />
          </Tabs>
        </header>
        <div className="content">
          {tabsIndex === 0 && (
            <AccountCreationCurrencies
              currency={account.currency}
              onSelect={selectCurrency}
            />
          )}
          {tabsIndex === 1 && (
            <AccountCreationOptions
              currency={account.currency}
              name={account.name}
              changeName={changeAccountName}
            />
          )}
          {tabsIndex === 2 && (
            <AccountCreationSecurity
              switchInternalModal={switchInternalModal}
              account={account}
            />
          )}
          {tabsIndex === 3 && <AccountCreationConfirmation account={account} />}
        </div>
        <div className="footer">
          {_.includes([0, 1, 2], tabsIndex) ? (
            <DialogButton
              highlight
              right
              disabled={isNextDisabled}
              onTouchTap={() => onSelect(parseInt(tabsIndex + 1, 10))}
            >
              {t("common:continue")}
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
