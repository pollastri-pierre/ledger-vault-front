import React, { Component } from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import CircularProgress from "material-ui/CircularProgress";
import { DialogButton, Overscroll } from "../../";
import OperationCreationAccounts from "./OperationCreationAccounts";
import OperationCreationDetails from "./OperationCreationDetails";

class OperationCreation extends Component {
  componentWillMount() {
    const { accounts, getAccounts } = this.props;

    if (!accounts.accounts && !accounts.isLoadingAccounts) {
      getAccounts();
    }
  }

  render() {
    const {
      close,
      onSelect,
      tabsIndex,
      save,
      accounts,
      operation,
      selectAccount
    } = this.props;

    const disabledTabs = [
      false, // tab 0
      operation.account === null, // tab 1
      true, // tab 2
      true // tab 3
    ];

    return (
      <Tabs
        className="operation-creation-main wrapper"
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
                {accounts.isLoadingAccounts ? <CircularProgress /> : false}
                {accounts.accounts && accounts.accounts.length > 0 ? (
                  <OperationCreationAccounts
                    accounts={accounts.accounts}
                    onSelect={selectAccount}
                    selectedAccount={operation.account}
                  />
                ) : (
                  false
                )}
              </Overscroll>
            </TabPanel>
            <TabPanel className="tabs_panel">
              <Overscroll>
                <OperationCreationDetails account={operation.account} />
              </Overscroll>
            </TabPanel>
            <TabPanel className="tabs_panel">
              <Overscroll>Label</Overscroll>
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
