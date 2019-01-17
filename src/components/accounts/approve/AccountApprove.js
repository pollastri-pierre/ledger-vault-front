// @flow
import React, { Component } from "react";
import OrganizationQuery from "api/queries/OrganizationQuery";
import { translate } from "react-i18next";
import { withRouter, Redirect } from "react-router";
import connectData from "restlay/connectData";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { withStyles } from "@material-ui/core/styles";
// import CircularProgress from "material-ui/CircularProgress";
import ApprovalPercentage from "components/ApprovalPercentage";
import ModalLoading from "components/ModalLoading";
import AccountQuery from "api/queries/AccountQuery";
import AccountsQuery from "api/queries/AccountsQuery";
import ProfileQuery from "api/queries/ProfileQuery";
import MembersQuery from "api/queries/MembersQuery";
import type { Member, Account, Translate } from "data/types";
import modals from "shared/modals";
import AccountApproveApprovals from "./AccountApproveApprovals";
import AccountApproveMembers from "./AccountApproveMembers";
import AccountApproveDetails from "./AccountApproveDetails";
import Footer from "../../approve/Footer";

const styles = {
  base: {
    ...modals.base,
    width: 450,
    height: 615
  }
};

type Props = {
  members: Array<Member>,
  profile: Member,
  t: Translate,
  account: Account,
  accounts: Account[],
  organization: *,
  close: Function,
  approve: Function,
  aborting: Function,
  classes: { [_: $Keys<typeof styles>]: string }
};

const GenericFooter = ({
  percentage,
  quorum,
  close,
  approve,
  aborting,
  profile,
  account
}: {
  percentage?: boolean,
  quorum?: number,
  close: Function,
  approve: Function,
  account: Account,
  profile: Member,
  aborting: Function
}) => (
  <Footer
    close={close}
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

class AccountApprove extends Component<Props, { value: number }> {
  state = {
    value: 0
  };

  handleChange = (event, value) => {
    this.setState({ value });
  };

  render() {
    const {
      profile,
      members,
      account,
      close,
      organization,
      t,
      approve,
      aborting,
      classes,
      accounts
    } = this.props;
    const { value } = this.state;
    return (
      <div className={classes.base}>
        <header>
          <h2>Account request</h2>
          <Tabs
            value={value}
            onChange={this.handleChange}
            indicatorColor="primary"
          >
            <Tab label={t("pendingAccount:tabs.details")} disableRipple />
            <Tab label={t("pendingAccount:tabs.members")} disableRipple />
            <Tab label={t("pendingAccount:tabs.status")} disableRipple />
          </Tabs>
        </header>
        {value === 0 && (
          <div>
            <AccountApproveDetails
              account={account}
              accounts={accounts}
              approvers={members}
              quorum={organization.quorum}
            />
            <GenericFooter
              profile={profile}
              aborting={aborting}
              account={account}
              close={close}
              approve={approve}
            />
          </div>
        )}
        {value === 1 && (
          <div>
            <AccountApproveMembers members={account.members} />
            <GenericFooter
              profile={profile}
              aborting={aborting}
              account={account}
              close={close}
              approve={approve}
            />
          </div>
        )}
        {value === 2 && (
          <div>
            <AccountApproveApprovals
              members={members}
              approvers={account.approvals}
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
          </div>
        )}
      </div>
    );
  }
}

const RenderError = withRouter(({ match }) => (
  <Redirect to={`${match.params["0"] || ""}`} />
));

const connected = connectData(withStyles(styles)(translate()(AccountApprove)), {
  RenderError,
  queries: {
    account: AccountQuery,
    accounts: AccountsQuery,
    members: MembersQuery,
    organization: OrganizationQuery,
    profile: ProfileQuery
  },
  propsToQueryParams: props => ({ accountId: props.match.params.id || "" }),
  RenderLoading: ModalLoading
});

export default withRouter(connected);
