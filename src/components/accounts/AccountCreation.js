import _ from 'lodash';
import React, { Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import PropTypes from 'prop-types';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { DialogButton } from '../';
import AccountCreationCurrencies from './AccountCreationCurrencies';
import AccountCreationOptions from './AccountCreationOptions';
import './AccountCreation.css';

class AccountCreation extends Component {
  componentWillMount() {
    const { currencies, getCurrencies } = this.props;
    if (_.isNull(currencies.currencies) && !currencies.isLoading) {
      getCurrencies();
    }
  }

  render() {
    const {
      currencies,
      close,
      changeAccountName,
      account,
      selectCurrency,
    } = this.props;

    let isNextDisabled = false;

    switch (this.props.tabsIndex) {
      case 0:
        isNextDisabled = (_.isNull(this.props.account.currency));
        break;
      case 1:
        isNextDisabled = (this.props.account.options.name === '');
        break;
      case 2:
        isNextDisabled = (_.isNull(this.props.account.currency));
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
          <Tabs className="account-creation" selectedIndex={this.props.tabsIndex} onSelect={this.props.onSelect}>
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
                      Security
                  </TabPanel>
                  <TabPanel className="tabs_panel">
                      Confirmation
                  </TabPanel>
                </div>
              </div>
            </div>
            <div className="footer">
              <DialogButton className="cancel" highlight onTouchTap={close}>Cancel</DialogButton>
              {(_.includes([0, 1, 2], this.props.tabsIndex)) ?
                <DialogButton
                  highlight
                  right
                  disabled={isNextDisabled}
                  onTouchTap={() => this.props.onSelect(parseInt(this.props.tabsIndex + 1, 10))}
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
}

AccountCreation.propTypes = {
  currencies: PropTypes.shape({}).isRequired,
  getCurrencies: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  changeAccountName: PropTypes.func.isRequired,
  selectCurrency: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  account: PropTypes.shape({
    currency: PropTypes.shape({}),
    options: PropTypes.shape({
      name: PropTypes.string,
    }),
  }).isRequired,
  tabsIndex: PropTypes.number.isRequired,
};

export default AccountCreation;
