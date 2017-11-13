//@flow
import React, { Component } from "react";
import Footer from "../../approve/Footer";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import OperationApproveDedails from "./OperationApproveDedails";
import OperationApproveApprovals from "./OperationApproveApprovals";
import OperationApproveLocks from "./OperationApproveLocks";
import ModalLoading from "../../../components/ModalLoading";
import { withRouter, Redirect } from "react-router";
import connectData from "../../../restlay/connectData";
import AccountQuery from "../../../api/queries/AccountQuery";
import OperationQuery from "../../../api/queries/OperationQuery";
import MembersQuery from "../../../api/queries/MembersQuery";
import ProfileQuery from "../../../api/queries/ProfileQuery";
import type { Account, Operation, Member } from "../../../data/types";

type Props = {
  account: Account,
  operation: Operation,
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
      account,
      profile,
      operation,
      members,
      close,
      approve,
      aborting
    } = this.props;

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
            <OperationApproveDedails operation={operation} account={account} />
          </TabPanel>
          <TabPanel className="tabs_panel">
            <OperationApproveApprovals
              members={members}
              operation={operation}
              account={account}
            />
          </TabPanel>
          <TabPanel className="tabs_panel">
            <OperationApproveLocks operation={operation} account={account} />
          </TabPanel>
        </div>
        <Footer
          close={close}
          approve={approve}
          aborting={aborting}
          approved={operation.approved.indexOf(profile.pub_key) > -1}
        />
      </Tabs>
    );
  }
}

const RenderError = () => {
  return <Redirect to="/pending" />;
};

export default withRouter(
  connectData(
    connectData(OperationApprove, {
      RenderError,
      RenderLoading: ModalLoading,
      queries: {
        account: AccountQuery
      },
      propsToQueryParams: ({ operation }) => ({
        accountId: operation.account_id
      })
    }),
    {
      RenderError,
      RenderLoading: ModalLoading,
      queries: {
        operation: OperationQuery,
        members: MembersQuery,
        profile: ProfileQuery
      },
      propsToQueryParams: props => ({
        operationId: props.match.params.id || ""
      })
    }
  )
);
