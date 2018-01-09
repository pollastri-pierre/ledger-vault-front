//@flow
import React from "react";
import groupBy from "lodash/groupBy";
import size from "lodash/size";
import { Link } from "react-router-dom";
import DateFormat from "../DateFormat";
import AccountName from "../AccountName";
import ApprovalStatus from "../ApprovalStatus";
import type { Account, Member } from "data/types";
import { withStyles } from "material-ui/styles";
import classnames from "classnames";
import styles from "./styles";

type Props = {
  accounts: Account[],
  approved?: boolean,
  approvers: Member[],
  user: Member,
  classes: Object
};
function PendingAccountApprove(props: Props) {
  const { accounts, approved, approvers, user, classes } = props;
  if (accounts.length === 0) {
    return <p>There are no accounts to approve</p>;
  }

  const nbCurrencies = size(
    groupBy(accounts, account => account.currency.family)
  );

  return (
    <div className={classes.base}>
      {!approved && (
        <div>
          <p className={classnames(classes.header, classes.headerBlack)}>
            {accounts.length === 1 ? (
              <span>1 account</span>
            ) : (
              <span>{accounts.length} accounts</span>
            )}
            <span>{nbCurrencies}</span>
          </p>
          <p className={classnames(classes.header, classes.headerLight)}>
            <span>pending approval</span>
            {nbCurrencies === 1 ? (
              <span>currency</span>
            ) : (
              <span>currencies</span>
            )}
          </p>
        </div>
      )}
      {accounts.map(account => (
        <Link
          className={classnames(classes.row, { [classes.approved]: approved })}
          to={`/pending/account/${account.id}`}
          key={account.id}
        >
          <div>
            <span className={classes.date}>
              <DateFormat date={account.creation_time} />
            </span>
            <span className={classes.name}>
              <AccountName name={account.name} currency={account.currency} />
            </span>
          </div>
          <div className={classes.status}>
            <ApprovalStatus
              approved={account.approved}
              approvers={approvers}
              nbRequired={approvers.length}
              user={user}
            />
            <span className={classes.currency}>{account.currency.family}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default withStyles(styles)(PendingAccountApprove);
