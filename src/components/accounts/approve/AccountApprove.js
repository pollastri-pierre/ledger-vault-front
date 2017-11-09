//@flow
import React, { Component } from "react";
import AccountQuery from "../../../api/queries/AccountQuery";
import ApproversQuery from "../../../api/queries/ApproversQuery";
import ProfileQuery from "../../../api/queries/ProfileQuery";
import MembersQuery from "../../../api/queries/MembersQuery";
import PendingsQuery from "../../../api/queries/PendingsQuery";
import ApproveAccount from "../../../api/mutations/ApproveAccountMutation";
import AbortAccount from "../../../api/mutations/AbortAccountMutation";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import { Overscroll } from "../../";
import ModalLoading from "../../../components/ModalLoading";
import AbortConfirmation from "../../approve/AbortConfirmation";
import ApproveDevice from "../../approve/ApproveDevice";
import AccountApproveDetails from "./AccountApproveDetails";
import AccountApproveMembers from "./AccountApproveMembers";
import AccountApproveApprovals from "./AccountApproveApprovals";
import Footer from "../../approve/Footer";
import connectData from "../../../restlay/connectData";
import "./AccountApprove.css";

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

class AccountApprove extends Component<
  {
    accountId: string,
    restlay: *,
    close: *,
    members: *,
    approvers: *,
    account: *,
    profile: *
  },
  *
> {
  state = {};

  aborting = () => {
    this.setState({ ...this.state, isAborting: !this.state.isAborting });
  };

  approving = () => {
    const { restlay, close, accountId } = this.props;
    this.setState({ ...this.state, isDevice: !this.state.isDevice });
    // TODO: replace delay by device API call
    return delay(500)
      .then(() => restlay.commitMutation(new ApproveAccount({ accountId })))
      .then(() => restlay.refreshQuery(new PendingsQuery()))
      .then(close);
  };

  abort = () => {
    const { restlay, accountId, close } = this.props;
    // TODO: replace delay by device API call
    return delay(500)
      .then(() => restlay.commitMutation(new AbortAccount({ accountId })))
      .then(() => restlay.refreshQuery(new PendingsQuery()))
      .then(close);
  };

  render() {
    const { members, approvers, close, account, profile } = this.props;

    if (this.state.isAborting) {
      return (
        <AbortConfirmation
          entity="account"
          aborting={this.aborting}
          abort={this.abort}
        />
      );
    }
    if (this.state.isDevice) {
      return <ApproveDevice entity="account" cancel={this.approving} />;
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
            <AccountApproveDetails account={account} approvers={approvers} />
          </TabPanel>
          <TabPanel className="tabs_panel">
            <Overscroll>
              <AccountApproveMembers members={members} account={account} />
            </Overscroll>
          </TabPanel>
          <TabPanel className="tabs_panel">
            <Overscroll>
              <AccountApproveApprovals
                approvers={approvers}
                account={account}
              />
            </Overscroll>
          </TabPanel>
        </div>
        <Footer
          close={close}
          approve={this.approving}
          aborting={this.aborting}
          approved={account.approved.indexOf(profile.pub_key) > -1}
        />
      </Tabs>
    );
  }
}

export default connectData(AccountApprove, {
  queries: {
    account: AccountQuery,
    members: MembersQuery,
    approvers: ApproversQuery,
    profile: ProfileQuery
  },
  propsToQueryParams: props => ({ accountId: props.accountId }),
  RenderLoading: ModalLoading
});
