//@flow
import React, { Component } from "react";
import ModalLoading from "../../../components/ModalLoading";
import PropTypes from "prop-types";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import AbortConfirmation from "../../approve/AbortConfirmation";
import ApproveDevice from "../../approve//ApproveDevice";
import OperationApproveDedails from "./OperationApproveDedails";
import OperationApproveApprovals from "./OperationApproveApprovals";
import OperationApproveLocks from "./OperationApproveLocks";
import connectData from "../../../restlay/connectData";
import Footer from "../../approve/Footer";
import OperationQuery from "../../../api/queries/OperationQuery";
import MembersQuery from "../../../api/queries/MembersQuery";
import ProfileQuery from "../../../api/queries/ProfileQuery";
import PendingsQuery from "../../../api/queries/PendingsQuery";
import ApproveOperation from "../../../api/mutations/ApproveOperationMutation";
import AbortOperation from "../../../api/mutations/AbortOperationMutation";

class OperationApprove extends Component<
  {
    operation: *,
    members: *,
    profile: *,
    restlay: *,
    operationId: string,
    close: Function
  },
  *
> {
  aborting = () => {
    this.setState({ ...this.state, isAborting: !this.state.isAborting });
  };

  approving = () => {
    const { restlay, close, operationId } = this.props;
    this.setState({ ...this.state, isDevice: !this.state.isDevice });

    // TODO: replace setTimeout by device API call
    setTimeout(() => {
      return restlay
        .commitMutation(new ApproveOperation({ operationId }))
        .then(() => restlay.refreshQuery(new PendingsQuery()))
        .then(close);
    }, 500);
  };

  abort = () => {
    const { restlay, operationId, close } = this.props;
    return restlay
      .commitMutation(new AbortOperation({ operationId }))
      .then(() => restlay.refreshQuery(new PendingsQuery()))
      .then(close);
  };

  render() {
    const { close, operation, members, profile } = this.props;

    if (this.state.isAborting) {
      return (
        <AbortConfirmation
          aborting={this.aborting}
          abort={this.abort}
          entity="operation"
        />
      );
    }

    if (this.state.isDevice) {
      return <ApproveDevice cancel={this.approving} entity="operation" />;
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
            <OperationApproveDedails operation={operation} />
          </TabPanel>
          <TabPanel className="tabs_panel">
            <OperationApproveApprovals
              members={members}
              operation={operation}
            />
          </TabPanel>
          <TabPanel className="tabs_panel">
            <OperationApproveLocks operation={operation} />
          </TabPanel>
        </div>
        <Footer
          close={close}
          approve={this.approving}
          aborting={this.aborting}
          approved={operation.approved.indexOf(profile.pub_key) > -1}
        />
      </Tabs>
    );
  }
}

export default connectData(OperationApprove, {
  queries: {
    operation: OperationQuery,
    members: MembersQuery,
    profile: ProfileQuery
  },
  propsToQueryParams: props => ({ operationId: props.operationId }),
  RenderLoading: ModalLoading
});
