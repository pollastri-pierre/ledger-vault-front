import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import CircularProgress from 'material-ui/CircularProgress';
import { DialogButton } from '../../';
import AbortConfirmation from './AbortConfirmation';
import ApproveDevice from './ApproveDevice';
import Footer from './Footer';
import './AccountApprove.css';

class AccountApprove extends Component {
  componentWillMount() {
    this.props.getAccount();
  }

  render() {
    const { close, account, abort, aborting, approving } = this.props;

    if (account.isLoading) {
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
          aborting={aborting}
          abort={abort}
        />
      );
    }
    if (account.isDevice) {
      return (
        <ApproveDevice
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
            details
          </TabPanel>
          <TabPanel className="tabs_panel">
            members
          </TabPanel>
          <TabPanel className="tabs_panel">
            approvals
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
