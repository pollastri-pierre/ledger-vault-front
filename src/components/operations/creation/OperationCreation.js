import React, { Component } from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import CircularProgress from "material-ui/CircularProgress";
import { DialogButton, Overscroll } from "../../";
import OperationCreationAccounts from "./OperationCreationAccounts";
import OperationCreationDetails from "./OperationCreationDetails";
import OperationCreationLabel from "./OperationCreationLabel";

class OperationCreation extends Component {
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
              <Overscroll>
                <OperationCreationDetails
                  account={selectedAccount}
                  details={details}
                  saveDetails={saveDetails}
                />
              </Overscroll>
            </TabPanel>
            <TabPanel className="tabs_panel">
              <Overscroll>
                <OperationCreationLabel />
              </Overscroll>
            </TabPanel>
            <TabPanel className="tabs_panel">
              <Overscroll>Confirmation</Overscroll>
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
              Done
            </DialogButton>
          )}
        </div>
      </Tabs>
    );
  }
}

OperationCreation.propTypes = {
  close: PropTypes.func.isRequired,
  tabsIndex: PropTypes.number.isRequired,
  onSelect: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired
};

export default OperationCreation;
