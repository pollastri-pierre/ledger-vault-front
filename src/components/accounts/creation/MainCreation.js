//@flow
import React, { Component } from "react";
import _ from "lodash";
import connectData from "../../../restlay/connectData";
import NewAccountMutation from "../../../api/mutations/NewAccountMutation";
import AccountCreationCurrencies from "./AccountCreationCurrencies";
import AccountCreationOptions from "./AccountCreationOptions";
import AccountCreationSecurity from "./AccountCreationSecurity";
import AccountCreationConfirmation from "./AccountCreationConfirmation";
import { DialogButton } from "../../";
import type { Currency } from "../../../data/types";
import { withStyles } from "material-ui/styles";
import modals from "../../../shared/modals";
import Tabs, { Tab } from "material-ui/Tabs";

type Props = {
  changeAccountName: Function,
  selectCurrency: (cur: Currency) => void,
  onSelect: Function,
  close: Function,
  switchInternalModal: Function,
  restlay: *,
  tabsIndex: number,
  account: *,
  classes: Object
};

const styles = {
  base: {
    ...modals.base,
    width: "440px",
    height: "615px"
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
      onSelect,
      tabsIndex,
      close,
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

    const save = () =>
      props.restlay
        .commitMutation(
          new NewAccountMutation({
            put_data_here: 42
          })
        )
        .then(close);

    return (
      <div className={classes.base}>
        <header>
          <h2>New account</h2>
          <Tabs onChange={this.handleChange} value={tabsIndex}>
            <Tab label="1. Currency" disableRipple />
            <Tab
              label="2. Options"
              disabled={_.isNull(account.currency)}
              disableRipple
            />
            <Tab
              label="3. Security"
              disabled={account.name === ""}
              disableRipple
            />
            <Tab
              label="4. Confirmation"
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
              Continue
            </DialogButton>
          ) : (
            <DialogButton highlight right onTouchTap={save}>
              Done
            </DialogButton>
          )}
        </div>
      </div>
    );
  }
}

export default connectData(withStyles(styles)(MainCreation));
