import React, {Component} from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import CircularProgress from 'material-ui/CircularProgress';
import {DialogButton, Overscroll} from '../../';
import AbortConfirmation from '../../approve/AbortConfirmation';
import ApproveDevice from '../../approve//ApproveDevice';
import OperationApproveDedails from './OperationApproveDedails';
import OperationApproveApprovals from './OperationApproveApprovals';
import ApprovalList from '../../ApprovalList';
import Footer from '../../approve/Footer';

class OperationApprove extends Component {
  componentWillMount() {
    // this.props.getOperation();
  }

  render() {
    const {
      close,
      operation,
      abort,
      approving,
      aborting,
      accounts,
      organization,
    } = this.props;

    if (operation.isAborting) {
      return (
        <AbortConfirmation
          aborting={aborting}
          abort={abort}
          entity="operation"
        />
      );
    }
    if (operation.isDevice) {
      return <ApproveDevice cancel={approving} entity="operation" />;
    }

    return (
      <Tabs id="account-creation" className="wrapper loading">
        <div className="header">
          <h2>Operation request</h2>
          <TabList>
            <Tab>details</Tab>
            <Tab>approvals</Tab>
            <Tab>locks</Tab>
          </TabList>
        </div>
        <div className="content">
          <TabPanel className="tabs_panel">
            <OperationApproveDedails
              operation={operation.operation}
              accounts={accounts.accounts}
            />
          </TabPanel>
          <TabPanel className="tabs_panel">
            <OperationApproveApprovals
              accounts={accounts.accounts}
              members={organization.members}
              operation={operation.operation}
            />
          </TabPanel>
          <TabPanel className="tabs_panel" />
        </div>
        <Footer
          close={close}
          approve={approving}
          aborting={aborting}
          approved={operation.isApproved}
        />
      </Tabs>
    );
  }
}

OperationApprove.propTypes = {
  getOperation: PropTypes.func.isRequired,
  close: PropTypes.func.isRequired,
  operation: PropTypes.shape({}).isRequired,
};

export default OperationApprove;
