//@flow
import React, { Component } from "react";
import OrganizationQuery from "api/queries/OrganizationQuery";
import type { Translate } from "data/types";
import { translate } from "react-i18next";
import { withRouter, Redirect } from "react-router";
import connectData from "restlay/connectData";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { withStyles } from "@material-ui/core/styles";
import Footer from "../../approve/Footer";
// import CircularProgress from "material-ui/CircularProgress";
import ApprovalPercentage from "components/ApprovalPercentage";
import AccountApproveDetails from "./AccountApproveDetails";
import AccountApproveMembers from "./AccountApproveMembers";
import ModalLoading from "components/ModalLoading";
import AccountApproveApprovals from "./AccountApproveApprovals";
import AccountQuery from "api/queries/AccountQuery";
import ProfileQuery from "api/queries/ProfileQuery";
import MembersQuery from "api/queries/MembersQuery";
import type { Member, Account } from "data/types";
import modals from "shared/modals";

const styles = {
  base: {
    ...modals.base,
    width: "440px",
    height: "615px"
  }
};

type Props = {
  members: Array<Member>,
  profile: Member,
  t: Translate,
  approvers: Array<Member>,
  account: Account,
  organization: *,
  close: Function,
  approve: Function,
  aborting: Function,
  classes: { [_: $Keys<typeof styles>]: string },
  match: *
};

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
      classes
    } = this.props;
    const { value } = this.state;

    const hasApproved = (approvers, profile) =>
      approvers.find(approver => approver.person.pub_key === profile.pub_key);

    const GenericFooter = ({
      percentage,
      quorum
    }: {
      percentage?: boolean,
      quorum?: number
    }) => (
      <Footer
        close={close}
        approve={() => approve(account)}
        aborting={aborting}
        approved={hasApproved(account.approvals, profile)}
        percentage={
          percentage && (
            <ApprovalPercentage
              approvers={members}
              approved={account.approvals}
              nbRequired={quorum}
            />
          )
        }
      />
    );

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
            <AccountApproveDetails account={account} approvers={members} />
            <GenericFooter />
          </div>
        )}
        {value === 1 && (
          <div>
            <AccountApproveMembers members={account.members} />
            <GenericFooter />
          </div>
        )}
        {value === 2 && (
          <div>
            <AccountApproveApprovals
              members={members}
              approvers={account.approvals}
            />
            <GenericFooter percentage quorum={organization.quorum} />
          </div>
        )}
      </div>
    );
  }
}

const RenderError = withRouter(({ match }) => {
  return <Redirect to={`${match.params["0"] || ""}`} />;
});

const connected = connectData(withStyles(styles)(translate()(AccountApprove)), {
  RenderError,
  queries: {
    account: AccountQuery,
    members: MembersQuery,
    organization: OrganizationQuery,
    profile: ProfileQuery
  },
  propsToQueryParams: props => ({ accountId: props.match.params.id || "" }),
  RenderLoading: ModalLoading
});

export default withRouter(connected);
