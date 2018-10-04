//@flow
import React from "react";
import groupBy from "lodash/groupBy";
import size from "lodash/size";
import type { Translate } from "data/types";
import { translate } from "react-i18next";
import { Link } from "react-router-dom";
import DateFormat from "../DateFormat";
import AccountName from "../AccountName";
import ApprovalStatus from "../ApprovalStatus";
import type { Account, Member } from "data/types";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router";
import classnames from "classnames";
import styles from "./styles";

const Empty = translate()(
  ({ t, approved }: { t: Translate, approved?: boolean }) => {
    if (approved) {
      return <p>{t("pending:accounts.watch.no_data")}</p>;
    }
    return <p>{t("pending:accounts.approve.no_data")}</p>;
  }
);
type Props = {
  accounts: Account[],
  approved?: boolean,
  approvers: Member[],
  quorum: Number,
  user: Member,
  match: *,
  classes: Object
};
function PendingAccountApprove(props: Props) {
  const { accounts, approved, approvers, user, classes, match, quorum } = props;

  if (accounts.length === 0) {
    return <Empty approved={approved} />;
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
          className={classnames(classes.row, "test-pending-account", {
            [classes.approved]: approved
          })}
          to={`${match.url}/account/${account.id}`}
          key={account.id}
        >
          <div>
            <span className={classes.date}>
              <DateFormat date={account.created_on} />
            </span>
            <span className={classes.name}>
              <AccountName name={account.name} currency={account.currency} />
            </span>
          </div>
          <div className={classes.status}>
            <ApprovalStatus
              approved={account.approvals || []}
              approvers={approvers}
              nbRequired={quorum}
              user={user}
            />
            <span className={classes.currency}>{account.currency.name}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default withStyles(styles)(withRouter(PendingAccountApprove));
