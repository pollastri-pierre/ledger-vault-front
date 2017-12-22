//@flow
import React, { Component } from "react";
import { withStyles } from "material-ui/styles";
import Tabs, { Tab } from "material-ui/Tabs";
import DialogButton from "../../buttons/DialogButton";
import Overscroll from "../../utils/Overscroll";
import OperationCreationAccounts from "./OperationCreationAccounts";
import OperationCreationDetails from "./OperationCreationDetails";
import OperationCreationLabel from "./OperationCreationLabel";
import OperationCreationConfirmation from "./OperationCreationConfirmation";
import type { Account } from "../../../data/types";
import type { Details } from "../../NewOperationModal";

const styles = {
  root: {
    width: 445,
    height: 612,
    display: "flex",
    flexDirection: "column"
  },
  title: {
    fontSize: 18,
    fontWeight: 400,
    color: "black",
    margin: 0,
    padding: 40,
    paddingBottom: 20
  },
  tabs: {
    margin: "0 40px",
    zIndex: 2
  },
  content: {
    height: 520,
    paddingTop: 40,
    paddingBottom: 72
  },
  footer: {
    position: "absolute",
    bottom: "0",
    left: "0",
    width: "100%",
    padding: "0 40px"
  }
};

const tabTitles = ["1. Account", "2. Details", "3. Label", "4. Confirmation"];

class OperationCreation extends Component<{
  close: () => void,
  tabsIndex: number,
  save: () => void,
  accounts: Account[],
  onTabsChange: number => void,
  selectedAccount: Account,
  selectAccount: Account => void,
  details: Details,
  saveDetails: Object => void,
  classes: { [_: $Keys<typeof styles>]: string }
}> {
  onTabChange = (e, value: number) => {
    this.props.onTabsChange(value);
  };
  render() {
    const {
      close,
      tabsIndex,
      save,
      accounts,
      selectedAccount,
      selectAccount,
      details,
      saveDetails,
      onTabsChange,
      classes
    } = this.props;

    const disabledTabs = [
      false, // tab 0
      selectedAccount === null, // tab 1
      !details.amount || !details.address || !details.fees, // tab 2
      !details.amount || !details.address || !details.fees // tab 3
    ];

    let content;
    switch (tabsIndex) {
      case 0:
        content = (
          <Overscroll top={40} bottom={72} paddingX={0}>
            <OperationCreationAccounts
              accounts={accounts}
              onSelect={selectAccount}
              selectedAccount={selectedAccount}
            />
          </Overscroll>
        );
        break;
      case 1:
        content = (
          <OperationCreationDetails
            account={selectedAccount}
            details={details}
            saveDetails={saveDetails}
          />
        );
        break;
      case 2:
        content = (
          <Overscroll top={40} bottom={72} paddingX={0}>
            <OperationCreationLabel />
          </Overscroll>
        );
        break;
      case 3:
        content = (
          <Overscroll top={40} bottom={72} paddingX={0}>
            <OperationCreationConfirmation
              account={selectedAccount}
              details={details}
            />
          </Overscroll>
        );
        break;
    }

    return (
      <div className={classes.root}>
        <h2 className={classes.title}>New operation</h2>
        <Tabs
          className={classes.tabs}
          value={tabsIndex}
          onChange={this.onTabChange}
        >
          {tabTitles.map((title, i) => (
            <Tab key={i} disabled={disabledTabs[i]} label={title} />
          ))}
        </Tabs>
        <div className={classes.content}>{content}</div>
        <div className={classes.footer}>
          <DialogButton onTouchTap={close}>Cancel</DialogButton>
          {tabsIndex <= 2 ? (
            <DialogButton
              highlight
              right
              disabled={disabledTabs[tabsIndex + 1]}
              onTouchTap={() => onTabsChange(tabsIndex + 1)}
            >
              Continue
            </DialogButton>
          ) : (
            <DialogButton highlight right onTouchTap={save}>
              Confirm
            </DialogButton>
          )}
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(OperationCreation);
