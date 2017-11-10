//@flow
import React from "react";
import _ from "lodash";
import connectData from "../../../restlay/connectData";
import NewAccountMutation from "../../../api/mutations/NewAccountMutation";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import AccountCreationCurrencies from "./AccountCreationCurrencies";
import AccountCreationOptions from "./AccountCreationOptions";
import AccountCreationSecurity from "./AccountCreationSecurity";
import AccountCreationConfirmation from "./AccountCreationConfirmation";
import { DialogButton, Overscroll } from "../../";
import type { Account, Currency } from "../../../datatypes";

type Props = {
  changeAccountName: Function,
  selectCurrency: (cur: Currency) => void,
  onSelect: Function,
  close: Function,
  switchInternalModal: Function,
  restlay: *,
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

  const save = () =>
    props.restlay
      .commitMutation(
        new NewAccountMutation({
          put_data_here: 42
        })
      )
      .then(close);

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
