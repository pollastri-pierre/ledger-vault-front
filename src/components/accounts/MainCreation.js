import _ from 'lodash';
import CircularProgress from 'material-ui/CircularProgress';
import AccountCreationCurrencies from './AccountCreationCurrencies';
import AccountCreationOptions from './AccountCreationOptions';
import AccountCreationSecurity from './AccountCreationSecurity';
import PropTypes from 'prop-types';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { DialogButton } from '../';
import React from 'react';

function MainCreation(props) {
  const {
    currencies,
    close,
    changeAccountName,
    account,
    selectCurrency,
    onSelect,
    tabsIndex,
    switchInternalModal,
  } = props;

  let isNextDisabled = false;

  switch (tabsIndex) {
    case 0:
      isNextDisabled = (_.isNull(account.currency));
      break;
    case 1:
      isNextDisabled = (account.options.name === '');
      break;
    case 2:
      isNextDisabled = (_.isNull(account.currency));
      break;
    default:
      isNextDisabled = true;
  }

  return (
    <div>
      {(currencies.isLoading || _.isNull(currencies.currencies)) ?
        <div className="account-creation">
          <div className="modal-loading">
            <CircularProgress />
          </div>
          <div className="footer">
            <DialogButton highlight className="cancel" onTouchTap={close}>Cancel</DialogButton>
          </div>
        </div>
        :
        <Tabs className="account-creation" selectedIndex={tabsIndex} onSelect={onSelect}>
          <div>
            <header>
              <h2>New account</h2>
              <TabList>
                <Tab > 1. Currency </Tab>
                <Tab
                  disabled={_.isNull(account.currency)}
                >
                  2. Options
                </Tab>
                <Tab
                  disabled={(account.options.name === '')}
                >
                  3. Security
                </Tab>
                <Tab disabled>4. Confirmation</Tab>
              </TabList>
            </header>
            <div className="content">
              <div className="inner">
                <TabPanel className="tabs_panel">
                  <AccountCreationCurrencies
                    currency={account.currency}
                    currencies={currencies.currencies}
                    onSelect={selectCurrency}
                  />
                </TabPanel>
                <TabPanel className="tabs_panel">
                  <AccountCreationOptions
                    currency={account.currency}
                    options={account.options}
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
                    Confirmation
                </TabPanel>
              </div>
            </div>
          </div>
          <div className="footer">
            <DialogButton className="cancel" highlight onTouchTap={close}>Cancel</DialogButton>
            {(_.includes([0, 1, 2], tabsIndex)) ?
              <DialogButton
                highlight
                right
                disabled={isNextDisabled}
                onTouchTap={() => onSelect(parseInt(tabsIndex + 1, 10))}
              >
                Continue
              </DialogButton>
              :
              <DialogButton highlight right onTouchTap={close}>Done</DialogButton>
            }
          </div>
        </Tabs>
      }
    </div>
  );
}

export default MainCreation;
