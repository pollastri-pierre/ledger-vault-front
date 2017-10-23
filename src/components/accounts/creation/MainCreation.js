import React from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import AccountCreationCurrencies from './AccountCreationCurrencies';
import AccountCreationOptions from './AccountCreationOptions';
import AccountCreationSecurity from './AccountCreationSecurity';
import AccountCreationConfirmation from './AccountCreationConfirmation';
import { DialogButton, Overscroll } from '../../';

function MainCreation(props) {
  const {
    currencies,
    close,
    changeAccountName,
    account,
    selectCurrency,
    onSelect,
    tabsIndex,
    save,
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
      isNextDisabled = (account.security.members.length === 0 ||
        account.security.approvals === 0 ||
        account.security.approvals > account.security.members.length);
      break;
    default:
      isNextDisabled = true;
  }

  return (
    <Tabs className="account-creation-main wrapper" selectedIndex={tabsIndex} onSelect={onSelect}>
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
            <Tab
              disabled={(account.security.members.length === 0 ||
                account.security.approvals === 0 ||
                account.security.approvals > account.security.members.length)
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
                currencies={currencies.currencies}
                onSelect={selectCurrency}
              />
            </Overscroll>
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
            <AccountCreationConfirmation
              account={account}
            />
          </TabPanel>
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
          <DialogButton highlight right onTouchTap={save}>Done</DialogButton>
        }
      </div>
    </Tabs>
  );
}

MainCreation.propTypes = {
  close: PropTypes.func.isRequired,
  changeAccountName: PropTypes.func.isRequired,
  currencies: PropTypes.shape({}).isRequired,
  account: PropTypes.shape({}).isRequired,
  tabsIndex: PropTypes.number.isRequired,
  selectCurrency: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  save: PropTypes.func.isRequired,
  switchInternalModal: PropTypes.func.isRequired,
};

export default MainCreation;
