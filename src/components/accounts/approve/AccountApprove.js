import React, { Component } from "react";
// import _ from "lodash";
import api from "../../../data/api-spec";
import PropTypes from "prop-types";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
// import CircularProgress from "material-ui/CircularProgress";
import { Overscroll } from "../../";
import ModalLoading from "../../../components/ModalLoading";
import AbortConfirmation from "../../approve/AbortConfirmation";
import ApproveDevice from "../../approve/ApproveDevice";
import AccountApproveDetails from "./AccountApproveDetails";
import AccountApproveMembers from "./AccountApproveMembers";
import AccountApproveApprovals from "./AccountApproveApprovals";
import Footer from "../../approve/Footer";
import connectData from "../../../decorators/connectData";
import "./AccountApprove.css";

class AccountApprove extends Component {
  constructor(props) {
    super(props);

    this.aborting = this.aborting.bind(this);
    this.approving = this.approving.bind(this);
    this.abort = this.abort.bind(this);

    this.state = {};
  }

  aborting() {
    this.setState({ ...this.state, isAborting: !this.state.isAborting });
  }

  approving() {
    const { fetchData, close } = this.props;
    this.setState({ ...this.state, isDevice: !this.state.isDevice });

    // TODO: replace setTimeout by device API call
    setTimeout(() => {
      return fetchData(api.approveOperation).then(() => {
        return fetchData(api.pendings).then(() => close());
      });
    }, 500);
  }

  abort() {
    const { fetchData, close } = this.props;
    return fetchData(api.abortAccount).then(() => {
      return fetchData(api.pendings).then(() => close());
    });
  }

  render() {
    const { members, approvers, close, account, abort, profile } = this.props;

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

AccountApprove.propTypes = {
  close: PropTypes.func.isRequired
};

export default connectData(AccountApprove, {
  api: {
    account: api.account,
    members: api.members,
    approvers: api.approvers,
    profile: api.profile
  },
  propsToApiParams: props => ({ accountId: props.accountId }),
  RenderLoading: ModalLoading
});
