//@flow
import React, { Component } from "react";
import ApprovalStatus from "../ApprovalStatus";
import AccountName from "../AccountName";
import { withStyles } from "@material-ui/core/styles";
import colors from "shared/colors";
import type { Account, Operation, Member } from "data/types";

const styles = {
  base: {
    fontSize: "11px",
    marginTop: "5px",
    marginBotton: "5px"
  },
  status: {
    color: colors.steel
  },
  account: {
    color: colors.black,
    float: "right"
  }
};

class ApprovalStatusWithAccountName extends Component<{
  account: Account,
  operation: Operation,
  classes: { [_: $Keys<typeof styles>]: string },
  user: Member
}> {
  render() {
    const { operation, account, user, classes } = this.props;
    return (
      <div className={classes.base}>
        <span className={classes.status}>
          <ApprovalStatus
            approvingObject={operation}
            approved={operation.approvals}
            approvers={account.members}
            nbRequired={account.security_scheme.quorum}
            user={user}
          />
        </span>
        <span className={classes.account}>
          <AccountName name={account.name} currencyId={account.currency_id} />
        </span>
      </div>
    );
  }
}

export default withStyles(styles)(ApprovalStatusWithAccountName);
