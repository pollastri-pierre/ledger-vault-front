// @flow

import React, { Component, Fragment } from "react";
import { withRouter, Redirect } from "react-router";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import AccountQuery from "api/queries/AccountQuery";
import AccountsQuery from "api/queries/AccountsQuery";
import UsersQuery from "api/queries/UsersQuery";
import OrganizationQuery from "api/queries/OrganizationQuery";
import ProfileQuery from "api/queries/ProfileQuery";
import type { Connection } from "restlay/ConnectionQuery";

import connectData from "restlay/connectData";
import { translate } from "react-i18next";

import ApprovalPercentage from "components/ApprovalPercentage";
import ApprovalList from "components/ApprovalList";
import ModalLoading from "components/ModalLoading";
import { ModalBody, ModalHeader, ModalTitle } from "components/base/Modal";

import type { User, Account, Translate } from "data/types";

import AccountApproveMembers from "./AccountApproveMembers";
import AccountApproveDetails from "./AccountApproveDetails";
import Footer from "../../approve/Footer";

type Props = {
  users: Connection<User>,
  profile: User,
  t: Translate,
  account: Account,
  accounts: Account[],
  organization: *,
  close: Function,
  approve: Function,
  aborting: Function,
};

type State = {
  tabIndex: number,
};

const GenericFooter = ({
  percentage,
  quorum,
  approve,
  aborting,
  profile,
  account,
}: {
  percentage?: boolean,
  quorum?: number,
  approve: Function,
  account: Account,
  profile: User,
  aborting: Function,
}) => (
  <Footer
    approve={() => approve(account)}
    aborting={aborting}
    approved={hasApproved(account.approvals, profile)}
    percentage={
      percentage && (
        <ApprovalPercentage approved={account.approvals} nbRequired={quorum} />
      )
    }
  />
);

const hasApproved = (approvers, profile) =>
  approvers.find(approver => approver.person.pub_key === profile.pub_key);

class AccountApprove extends Component<Props, State> {
  state = {
    tabIndex: 0,
  };

  handleChange = (event, tabIndex) => {
    this.setState({ tabIndex });
  };

  render() {
    const {
      profile,
      users,
      account,
      close,
      organization,
      t,
      approve,
      aborting,
      accounts,
    } = this.props;

    const { tabIndex } = this.state;
    // TODO need an endpoint not paginated for this
    const paginatedUsers = users.edges.map(e => e.node);

    const tabs = (
      <Tabs
        value={tabIndex}
        onChange={this.handleChange}
        indicatorColor="primary"
      >
        <Tab label={t("pendingAccount:tabs.details")} disableRipple />
        <Tab label={t("pendingAccount:tabs.members")} disableRipple />
        <Tab label={t("pendingAccount:tabs.status")} disableRipple />
      </Tabs>
    );

    return (
      <ModalBody height={615} onClose={close}>
        <ModalHeader>
          <ModalTitle>Account request</ModalTitle>
          {tabs}
        </ModalHeader>

        {tabIndex === 0 && (
          <Fragment>
            <AccountApproveDetails
              account={account}
              accounts={accounts}
              approvers={paginatedUsers}
              quorum={organization.quorum}
            />
            <GenericFooter
              profile={profile}
              aborting={aborting}
              account={account}
              close={close}
              approve={approve}
            />
          </Fragment>
        )}

        {tabIndex === 1 && (
          <Fragment>
            <AccountApproveMembers members={account.members} />
            <GenericFooter
              profile={profile}
              aborting={aborting}
              account={account}
              close={close}
              approve={approve}
            />
          </Fragment>
        )}

        {tabIndex === 2 && (
          <Fragment>
            <ApprovalList
              approvers={paginatedUsers}
              approved={account.approvals}
            />
            <GenericFooter
              percentage
              quorum={organization.quorum}
              profile={profile}
              aborting={aborting}
              account={account}
              close={close}
              approve={approve}
            />
          </Fragment>
        )}
      </ModalBody>
    );
  }
}

const RenderError = withRouter(({ match }) => (
  <Redirect to={`${match.params["0"] || ""}`} />
));

const connected = connectData(translate()(AccountApprove), {
  RenderError,
  queries: {
    account: AccountQuery,
    accounts: AccountsQuery,
    users: UsersQuery,
    organization: OrganizationQuery,
    profile: ProfileQuery,
  },
  initialVariables: {
    // TODO remove this when endpoint is not paginated anymore
    users: 30,
  },
  propsToQueryParams: props => ({ accountId: props.match.params.id || "" }),
  RenderLoading: ModalLoading,
});

export default withRouter(connected);
