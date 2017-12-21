//@flow
import React, { Component } from "react";
import connectData from "../../restlay/connectData";
import EntityApprove from "../../components/approve/EntityApprove";
import {
  PendingAccountApprove,
  PendingOperationApprove
} from "../../components";
import AccountsQuery from "../../api/queries/AccountsQuery";
import ModalRoute from "../../components/ModalRoute";
import ProfileQuery from "../../api/queries/ProfileQuery";
import PendingsQuery from "../../api/queries/PendingsQuery";
import ApproversQuery from "../../api/queries/ApproversQuery";
import SpinnerCard from "../../components/spinners/SpinnerCard";
import Card from "../../components/Card";
import TryAgain from "../../components/TryAgain";
import type { Account, Member } from "../../data/types";
import { withStyles } from "material-ui/styles";
import type { Response as PendingRequestsQueryResponse } from "../../api/queries/PendingsQuery";

const EntityApproveAccount = props => (
  <EntityApprove entity="account" {...props} />
);
const EntityApproveOperation = props => (
  <EntityApprove entity="operation" {...props} />
);

const styles = {
  base: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around"
  },
  left: {
    width: "50%",
    marginRight: "10px"
  },
  right: {
    width: "50%",
    marginLeft: "10px"
  }
};

class PendingRequests extends Component<{
  accounts: Account[],
  pendingRequests: PendingRequestsQueryResponse,
  approversAccount: Member[],
  profile: Member
}> {
  render() {
    const {
      accounts,
      pendingRequests,
      classes,
      approversAccount,
      profile
    } = this.props;

    return (
      <div className={classes.base}>
        <ModalRoute path="*/account/:id" component={EntityApproveAccount} />
        <ModalRoute path="*/operation/:id" component={EntityApproveOperation} />
        <div className={classes.left}>
          <Card title="Operations to approve">
            <PendingOperationApprove
              operations={pendingRequests.approveOperations}
              accounts={accounts}
              user={profile}
            />
          </Card>
          <Card title="Operations to watch">
            <PendingOperationApprove
              operations={pendingRequests.watchOperations}
              approved
              user={profile}
              accounts={accounts}
            />
          </Card>
        </div>
        <div className={classes.right}>
          <Card title="Accounts to approve">
            <PendingAccountApprove
              accounts={pendingRequests.approveAccounts}
              approvers={approversAccount}
              user={profile}
            />
          </Card>
          <Card title="Accounts to watch">
            <PendingAccountApprove
              accounts={pendingRequests.watchAccounts}
              approvers={approversAccount}
              user={profile}
              approved
            />
          </Card>
        </div>
      </div>
    );
  }
}

export { PendingRequests as PendingRequestNotDecorated };

const RenderError = ({ error, restlay }: *) => (
  <TryAgain error={error} action={restlay.forceFetch} />
);

const RenderLoading = withStyles(styles)(({ classes }) => (
  <div className={classes.base}>
    <div className={classes.left}>
      <Card title="Operations to approve">
        <SpinnerCard />
      </Card>
      <Card title="Operations to watch">
        <SpinnerCard />
      </Card>
    </div>
    <div className={classes.right}>
      <Card title="Accounts to approve">
        <SpinnerCard />
      </Card>
      <Card title="Accounts to watch">
        <SpinnerCard />
      </Card>
    </div>
  </div>
));

export default connectData(withStyles(styles)(PendingRequests), {
  RenderError,
  RenderLoading,
  queries: {
    pendingRequests: PendingsQuery,
    accounts: AccountsQuery,
    profile: ProfileQuery,
    approversAccount: ApproversQuery
  }
});
