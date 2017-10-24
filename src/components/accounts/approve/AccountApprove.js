import React, { Component } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import CircularProgress from 'material-ui/CircularProgress';
import { DialogButton, Overscroll } from '../../';
import AbortConfirmation from '../../approve/AbortConfirmation';
import ApproveDevice from '../../approve/ApproveDevice';
import AccountApproveDetails from './AccountApproveDetails';
import AccountApproveMembers from './AccountApproveMembers';
import AccountApproveApprovals from './AccountApproveApprovals';
import Footer from '../../approve/Footer';
import './AccountApprove.css';

class AccountApprove extends Component {
  componentWillMount() {
    this.props.getAccount();
  }

  render() {
    const {
      organization,
      getOrganizationMembers,
      getOrganizationApprovers,
      close,
      account,
      abort,
      aborting,
      approving 
    } = this.props;

    if (account.isLoading || _.isNull(account.account)) {
      return (
        <div id="account-creation" className="wrapper loading">
          <div className="header" />
          <div className="content">
            <CircularProgress
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                marginLeft: '-25px',
                marginTop: '-25px',
              }}
            />

          </div>
          <div className="footer">
            <DialogButton highlight className="cancel" onTouchTap={close}>Close</DialogButton>
          </div>
        </div>
      );
    }

    if (account.isAborting) {
      return (
        <AbortConfirmation
          entity="account"
          aborting={aborting}
          abort={abort}
        />
      );
    }
    if (account.isDevice) {
      return (
        <ApproveDevice
          entity="account"
          cancel={approving}
        />
      );
    }

    return (
      <Tabs id="account-creation" className="wrapper loading">
        <div className="header">
          <h2>Account request</h2>
          <TabList>
            <Tab>details</Tab>
            <Tab>members</Tab>
            <Tab>approvals</Tab>
          </TabList>
        </div>
        <div className="content">
          <TabPanel className="tabs_panel">
            <AccountApproveDetails
              account={account.account}
              organization={organization}
            />
          </TabPanel>
          <TabPanel className="tabs_panel">
            <Overscroll>
              <AccountApproveMembers
                organization={organization}
                getOrganizationMembers={getOrganizationMembers}
                account={account.account}
              />
            </Overscroll>
          </TabPanel>
          <TabPanel className="tabs_panel">
            <Overscroll>
              <AccountApproveApprovals
                organization={organization}
                getOrganizationMembers={getOrganizationMembers}
                getOrganizationApprovers={getOrganizationApprovers}
                account={account.account}
              />
            </Overscroll>
          </TabPanel>
        </div>
        <Footer
          close={close}
          approve={approving}
          aborting={aborting}
          approved={account.isApproved}
        />
      </Tabs>
    );
  }
}

AccountApprove.propTypes = {
  getAccount: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  account: PropTypes.shape({}).isRequired,
};

export default AccountApprove;
