import React, { Component } from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import CircularProgress from "material-ui/CircularProgress";
import { DialogButton, Overscroll } from "../../";
import AbortConfirmation from "../../approve/AbortConfirmation";
import ApproveDevice from "../../approve//ApproveDevice";
import OperationApproveDedails from "./OperationApproveDedails";
import OperationApproveApprovals from "./OperationApproveApprovals";
import OperationApproveLocks from "./OperationApproveLocks";
import ApprovalList from "../../ApprovalList";
import Footer from "../../approve/Footer";

class OperationApprove extends Component {
  componentWillMount() {
    this.props.getOrganizationMembers();
  }

  render() {
    const {
      close,
      operation,
      abort,
      approving,
      aborting,
      accounts,
      organization
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

    if (organization.isLoading || _.isNull(organization.members)) {
      return (
        <div id="account-creation" className="wrapper loading">
          <div className="header" />
          <div className="content">
            <CircularProgress
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                marginLeft: "-25px",
                marginTop: "-25px"
              }}
            />
          </div>
          <div className="footer">
            <DialogButton highlight className="cancel" onTouchTap={close}>
              Close
            </DialogButton>
          </div>
        </div>
      );
    }

    if (operation.isDevice) {
      return <ApproveDevice cancel={approving} entity="operation" />;
    }

    const currentAccount = _.find(
      accounts.accounts,
      account => account.id === operation.operation.account_id
    );

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
              account={currentAccount}
            />
          </TabPanel>
          <TabPanel className="tabs_panel">
            <OperationApproveApprovals
              members={organization.members}
              account={currentAccount}
              operation={operation.operation}
            />
          </TabPanel>
          <TabPanel className="tabs_panel">
            <OperationApproveLocks
              account={currentAccount}
              operation={operation.operation}
            />
          </TabPanel>
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
  operation: PropTypes.shape({}).isRequired
};

export default OperationApprove;
