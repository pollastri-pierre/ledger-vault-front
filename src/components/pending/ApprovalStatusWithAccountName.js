// @flow
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import colors from "shared/colors";
import type { Account, Operation, Member } from "data/types";
import Text from "components/base/Text";
import AccountName from "../AccountName";
import ApprovalStatus from "../ApprovalStatus";

const styles = {
  base: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 5,
    marginBotton: 5,
  },
  status: {
    color: colors.steel,
  },
  account: {
    color: colors.black,
  },
};

class ApprovalStatusWithAccountName extends Component<{
  account: Account,
  operation: Operation,
  classes: { [_: $Keys<typeof styles>]: string },
  user: Member,
}> {
  render() {
    const { operation, account, user, classes } = this.props;
    return (
      <div className={classes.base}>
        <Text small className={classes.status}>
          <ApprovalStatus
            approvingObject={operation}
            approved={operation.approvals}
            approvers={account.members}
            nbRequired={account.security_scheme.quorum}
            user={user}
          />
        </Text>
        <Text small className={classes.account}>
          <AccountName account={account} />
        </Text>
      </div>
    );
  }
}

export default withStyles(styles)(ApprovalStatusWithAccountName);
