import React, { Component } from "react";
import _ from "lodash";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { DialogButton, Overscroll } from "../../";
import OperationCreationAccounts from "./OperationCreationAccounts";
import OperationCreationDetails from "./OperationCreationDetails";
import OperationCreationLabel from "./OperationCreationLabel";
import OperationCreationConfirmation from "./OperationCreationConfirmation";

import "./OperationCreation.css";

class OperationCreation extends Component<*> {
  render() {
    const {
      close,
      onSelect,
      tabsIndex,
      save,
      accounts,
      selectedAccount,
      selectAccount,
      details,
      saveDetails
    } = this.props;

    const disabledTabs = [
      false, // tab 0
      selectedAccount === null, // tab 1
      !details.amount || !details.address || !details.fees, // tab 2
      !details.amount || !details.address || !details.fees // tab 3
    ];

    return (
      <Tabs
        className="operation-creation-main modal wrapper"
        selectedIndex={tabsIndex}
        onSelect={onSelect}
      >
        <div>
          <header>
            <h2>New operation</h2>
            <TabList>
              <Tab> 1. Account </Tab>
              <Tab disabled={disabledTabs[1]}>2. Details</Tab>
              <Tab disabled={disabledTabs[2]}>3. Label</Tab>
              <Tab disabled={disabledTabs[3]}>4. Confirmation</Tab>
            </TabList>
          </header>
          <div className="content">
            <TabPanel className="tabs_panel">
              <Overscroll>
                {accounts && accounts.length > 0 ? (
                  <OperationCreationAccounts
                    accounts={accounts}
                    onSelect={selectAccount}
                    selectedAccount={selectedAccount}
                  />
                ) : (
                  false
                )}
              </Overscroll>
            </TabPanel>
            <TabPanel className="tabs_panel">
              <OperationCreationDetails
                account={selectedAccount}
                details={details}
                saveDetails={saveDetails}
              />
            </TabPanel>
            <TabPanel className="tabs_panel">
              <Overscroll>
                <OperationCreationLabel />
              </Overscroll>
            </TabPanel>
            <TabPanel className="tabs_panel">
              <Overscroll>
                <OperationCreationConfirmation
                  account={selectedAccount}
                  details={details}
                />
              </Overscroll>
            </TabPanel>
          </div>
        </div>
        <div className="footer">
          <DialogButton className="cancel" highlight onTouchTap={close}>
            Cancel
          </DialogButton>
          {_.includes([0, 1, 2], tabsIndex) ? (
            <DialogButton
              highlight
              right
              disabled={disabledTabs[tabsIndex + 1]}
              onTouchTap={() => onSelect(tabsIndex + 1)}
            >
              Continue
            </DialogButton>
          ) : (
            <DialogButton highlight right onTouchTap={save}>
              Confirm
            </DialogButton>
          )}
        </div>
      </Tabs>
    );
  }
}

export default OperationCreation;
