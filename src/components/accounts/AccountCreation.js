import _ from 'lodash';
import React, { Component } from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import PropTypes from 'prop-types';
import { DialogButton } from '../';
import MainCreation from './MainCreation';
import AccountCreationMembers from './AccountCreationMembers';
import AccountCreationApprovals from './AccountCreationApprovals';
import AccountCreationTimeLock from './AccountCreationTimeLock';
import AccountCreationRateLimiter from './AccountCreationRateLimiter';
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
      organization,
      currencies,
      close,
      changeAccountName,
      account,
      selectCurrency,
      onSelect,
      tabsIndex,
      switchInternalModal,
      getOrganizationMembers,
      addMember,
      setApprovals,
      enableTimeLock,
      enableRatelimiter,
      openPopBubble,
      changeTimeLock,
      changeRatelimiter,
      changeFrequency,
      save,
    } = this.props;

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

    let content;
    switch (account.internModalId) {
      case 'time-lock':
        content = (<AccountCreationTimeLock
          switchInternalModal={switchInternalModal}
          timelock={account.security.timelock}
          enable={enableTimeLock}
          change={changeTimeLock}
          popbubble={account.popBubble}
          anchor={account.popAnchor}
          openPopBubble={openPopBubble}
          changeFrequency={changeFrequency}
        />);
        break;
      case 'rate-limiter':
        content = (<AccountCreationRateLimiter
          switchInternalModal={switchInternalModal}
          ratelimiter={account.security.ratelimiter}
          enable={enableRatelimiter}
          change={changeRatelimiter}
          popbubble={account.popBubble}
          anchor={account.popAnchor}
          openPopBubble={openPopBubble}
          changeFrequency={changeFrequency}
        />);
        break;
      case 'members':
        content = (<AccountCreationMembers
          members={account.security.members}
          organization={organization}
          switchInternalModal={switchInternalModal}
          addMember={addMember}
          getOrganizationMembers={getOrganizationMembers}
        />);
        break;
      case 'approvals':
        content = (<AccountCreationApprovals
          setApprovals={setApprovals}
          members={account.security.members}
          approvals={account.security.approvals}
          switchInternalModal={switchInternalModal}
        />);
        break;
      default:
        content = (<MainCreation
          currencies={currencies}
          close={close}
          account={account}
          changeAccountName={changeAccountName}
          selectCurrency={selectCurrency}
          tabsIndex={tabsIndex}
          onSelect={onSelect}
          save={save}
          switchInternalModal={switchInternalModal}
        />);
        break;
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
          <div>
            {content}
          </div>
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
