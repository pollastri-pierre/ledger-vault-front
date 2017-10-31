import React, { Component } from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import CircularProgress from "material-ui/CircularProgress";
import { DialogButton, Overscroll } from "../../";
import OperationCreationAccounts from "./OperationCreationAccounts";

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
      getAccounts
    } = this.props;

    let isNextDisabled = false;

    // switch (tabsIndex) {
    //   case 0:
    //     isNextDisabled = (_.isNull(account.currency));
    //     break;
    //   case 1:
    //     isNextDisabled = (account.options.name === '');
    //     break;
    //   case 2:
    //     isNextDisabled = (account.security.members.length === 0 ||
    //       account.security.approvals === 0 ||
    //       account.security.approvals > account.security.members.length);
    //     break;
    //   default:
    //     isNextDisabled = true;
    // }
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
              <Tab disabled={false}>2. Details</Tab>
              <Tab disabled={false}>3. Label</Tab>
              <Tab disabled={false}>4. Confirmation</Tab>
            </TabList>
          </header>
          <div className="content">
            <TabPanel className="tabs_panel">
              <Overscroll>
                {accounts.isLoadingAccounts ? <CircularProgress /> : false}
                {accounts.accounts && accounts.accounts.length > 0 ? (
                  <OperationCreationAccounts
                    accounts={accounts.accounts}
                    onSelect={cur => console.log(cur)}
                  />
                ) : (
                  false
                )}
              </Overscroll>
            </TabPanel>
            <TabPanel className="tabs_panel">
              <Overscroll>Details</Overscroll>
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
