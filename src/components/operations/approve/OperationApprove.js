//@flow
import React, { Component } from "react";
import Footer from "../../approve/Footer";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import OperationApproveDedails from "./OperationApproveDedails";
import OperationApproveApprovals from "./OperationApproveApprovals";
import ApprovalPercentage from "../../../components/ApprovalPercentage";
import OperationApproveLocks from "./OperationApproveLocks";
import ModalLoading from "../../../components/ModalLoading";
import { withRouter, Redirect } from "react-router";
import connectData from "../../../restlay/connectData";
import OperationWithAccountQuery from "../../../api/queries/OperationWithAccountQuery";
import MembersQuery from "../../../api/queries/MembersQuery";
import LocksPercentage from "../../LocksPercentage";
import ProfileQuery from "../../../api/queries/ProfileQuery";
import { calculateApprovingObjectMeta } from "../../../data/approvingObject";
import type { Account, Operation, Member } from "../../../data/types";

type Props = {
  operationWithAccount: {
    account: Account,
    operation: Operation
  },
  members: Array<Member>,
  profile: Member,
  close: Function,
  approve: Function,
  aborting: Function,
  match: *
};
class OperationApprove extends Component<Props> {
  render() {
    const {
      operationWithAccount: { account, operation },
      profile,
      members,
      close,
      approve,
      aborting
    } = this.props;

    const approvers = [];
    account.security_scheme.approvers.forEach(approver => {
      const member = members.find(m => m.pub_key === approver);
      if (member) {
        approvers.push(member);
      }
    });

    const quorum = account.security_scheme.quorum;
    const isUnactive =
      operation.approved.length < account.security_scheme.quorum;
    const approvingObjectMeta = calculateApprovingObjectMeta(operation);

    return (
      <Tabs>
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
              operation={operation}
              account={account}
              profile={profile}
            />
            <Footer
              close={close}
              approve={approve}
              aborting={aborting}
              approved={operation.approved.indexOf(profile.pub_key) > -1}
            />
          </TabPanel>
          <TabPanel className="tabs_panel">
            <OperationApproveApprovals
              members={members}
              operation={operation}
              account={account}
            />
            <Footer
              close={close}
              approve={approve}
              aborting={aborting}
              approved={operation.approved.indexOf(profile.pub_key) > -1}
              percentage={
                <ApprovalPercentage
                  approvers={approvers}
                  approved={operation.approved}
                  nbRequired={quorum}
                />
              }
            />
          </TabPanel>
          <TabPanel className="tabs_panel">
            <OperationApproveLocks operation={operation} account={account} />
            <Footer
              close={close}
              approve={approve}
              aborting={aborting}
              approved={operation.approved.indexOf(profile.pub_key) > -1}
              percentage={
                isUnactive || !approvingObjectMeta ? (
                  <LocksPercentage />
                ) : (
                  <LocksPercentage
                    percentage={approvingObjectMeta.globalPercentage}
                  />
                )
              }
            />
          </TabPanel>
        </div>
      </Tabs>
    );
  }
}

const RenderError = () => {
  return <Redirect to="/pending" />;
};

export default withRouter(
  connectData(OperationApprove, {
    RenderError,
    RenderLoading: ModalLoading,
    queries: {
      operationWithAccount: OperationWithAccountQuery,
      members: MembersQuery,
      profile: ProfileQuery
    },
    propsToQueryParams: props => ({
      operationId: props.match.params.id || ""
    })
  })
);
