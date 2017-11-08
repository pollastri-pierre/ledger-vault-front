//@flow
import React from "react";
import _ from "lodash";
import connectData from "../../../decorators/connectData";
import api from "../../../data/api-spec";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import AccountCreationCurrencies from "./AccountCreationCurrencies";
import AccountCreationOptions from "./AccountCreationOptions";
import AccountCreationSecurity from "./AccountCreationSecurity";
import AccountCreationConfirmation from "./AccountCreationConfirmation";
import { DialogButton, Overscroll } from "../../";

type Props = {
  changeAccountName: Function,
  selectCurrency: Function,
  onSelect: Function,
  close: Function,
  switchInternalModal: Function,
  fetchData: Function,
  tabsIndex: number,
  account: *
};

function MainCreation(props: Props) {
  const {
    changeAccountName,
    account,
    selectCurrency,
    onSelect,
    tabsIndex,
    close,
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
    // TODO formating data to send it to the API here
    const data = { data: "23" };
    return props.fetchData(api.newAccount, data).then(() => close());
  };

  return (
    <Tabs
      className="account-creation-main wrapper"
      selectedIndex={tabsIndex}
      onSelect={onSelect}
    >
      <div>
        <header>
          <h2>New account</h2>
          <TabList>
            <Tab> 1. Currency </Tab>
            <Tab disabled={_.isNull(account.currency)}>2. Options</Tab>
            <Tab disabled={account.name === ""}>3. Security</Tab>
            <Tab
              disabled={
                account.approvers.length === 0 ||
                account.quorum === 0 ||
                account.quorum > account.approvers.length
              }
            >
              4. Confirmation
            </Tab>
          </TabList>
        </header>
        <div className="content">
          <TabPanel className="tabs_panel">
            <Overscroll>
              <AccountCreationCurrencies
                currency={account.currency}
                onSelect={selectCurrency}
              />
            </Overscroll>
          </TabPanel>
          <TabPanel className="tabs_panel">
            <AccountCreationOptions
              currency={account.currency}
              name={account.name}
              changeName={changeAccountName}
            />
          </TabPanel>
          <TabPanel className="tabs_panel">
            <AccountCreationSecurity
              switchInternalModal={switchInternalModal}
              account={account}
            />
          </TabPanel>
          <TabPanel className="tabs_panel">
            <AccountCreationConfirmation account={account} />
          </TabPanel>
        </div>
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
    </Tabs>
  );
}

export default connectData(MainCreation);
