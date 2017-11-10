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
import OperationQuery from "../../../api/queries/OperationQuery";
import MembersQuery from "../../../api/queries/MembersQuery";
import ProfileQuery from "../../../api/queries/ProfileQuery";

type Props = {
  operation: *,
  members: array,
  profile: *,
  close: Function,
  approve: Function,
  aborting: Function
};
class OperationApprove extends Component<Props> {
  render() {
    const {
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
          approve={approve}
          aborting={aborting}
          approved={operation.approved.indexOf(profile.pub_key) > -1}
        />
      </Tabs>
    );
  }
}

export default withRouter(
  connectData(OperationApprove, {
    RenderError: () => {
      return <Redirect to="/pending" />;
    },
    queries: {
      operation: OperationQuery,
      members: MembersQuery,
      profile: ProfileQuery
    },
    propsToQueryParams: props => ({
      operationId: props.match.params.id
    }),
    RenderLoading: ModalLoading
  })
);
