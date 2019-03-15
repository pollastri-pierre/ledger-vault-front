// @flow
import React, { Component } from "react";
import connectData from "restlay/connectData";
import EntityApprove from "components/approve/EntityApprove";
import ModalRoute from "components/ModalRoute";
import ProfileQuery from "api/queries/ProfileQuery";
import SpinnerCard from "components/spinners/SpinnerCard";
import type { Member } from "data/types";
import { withStyles } from "@material-ui/core/styles";
import Operations from "./Operations";
import Accounts from "./Accounts";

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
    justifyContent: "space-around",
    "& p": {
      margin: 0,
    },
  },
  left: {
    width: "50%",
    marginRight: "10px",
  },
  right: {
    width: "50%",
    marginLeft: "10px",
  },
};

class PendingRequests extends Component<{
  classes: { [_: $Keys<typeof styles>]: string },
  profile: Member,
}> {
  render() {
    const { classes, profile } = this.props;
    return (
      <div className={classes.base}>
        <ModalRoute
          path="*/account/:id"
          render={({ match, history }) => (
            <EntityApproveAccount match={match} history={history} />
          )}
        />
        <ModalRoute path="*/operation/:id" component={EntityApproveOperation} />
        <div className={classes.left}>
          <Operations user={profile} />
        </div>
        <div className={classes.right}>
          <Accounts user={profile} />
        </div>
      </div>
    );
  }
}

export { PendingRequests as PendingRequestNotDecorated };
const RenderLoading = () => <SpinnerCard />;

export default connectData(withStyles(styles)(PendingRequests), {
  RenderLoading,
  queries: {
    profile: ProfileQuery,
  },
});
