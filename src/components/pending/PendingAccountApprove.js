// @flow
import React, { Fragment } from "react";
import groupBy from "lodash/groupBy";
import size from "lodash/size";
import { Trans, Interpolate } from "react-i18next";
import { Link } from "react-router-dom";
import type { Account, User } from "data/types";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router";
import classnames from "classnames";
import { getAccountCurrencyName } from "utils/accounts";
import Text from "components/base/Text";
import LineSeparator from "components/LineSeparator";
import styles from "./styles";
import ApprovalStatus from "../ApprovalStatus";
import AccountName from "../AccountName";
import DateFormat from "../DateFormat";
import PendingEmptyState from "./PendingEmptyState";

const Empty = ({ approved }: { approved?: boolean }) =>
  approved ? (
    <PendingEmptyState
      text={<Trans i18nKey="pending:accounts.watch.no_data" />}
    />
  ) : (
    <PendingEmptyState
      text={<Trans i18nKey="pending:accounts.approve.no_data" />}
    />
  );

type Props = {
  accounts: Account[],
  approved?: boolean,
  approvers: User[],
  quorum: Number,
  user: User,
  match: *,
  classes: { [_: $Keys<typeof styles>]: string },
};
function PendingAccountApprove(props: Props) {
  const { accounts, approved, approvers, user, classes, match, quorum } = props;

  if (accounts.length === 0) {
    return <Empty approved={approved} />;
  }

  const nbCurrencies = size(groupBy(accounts, account => account.currency_id));

  return (
    <div className={classes.base}>
      {!approved && (
        <Fragment>
          <div className={classes.headerContainer}>
            <Text className={classes.header}>
              <Interpolate
                i18nKey="pending:accounts.approve.account"
                options={{ count: accounts.length }}
                numberOfAccounts={accounts.length}
              />
            </Text>
            <Text className={classes.header}>{nbCurrencies}</Text>
          </div>
          <div className={classes.headerContainer}>
            <Text
              small
              className={classes.subHeader}
              i18nKey="pending:operations.approve.status"
            />
            <Text small className={classes.subHeader}>
              {/* ------------------------------- */}
              {/* FIXME interpolate is deprecated */}
              {/* ------------------------------- */}
              <Interpolate
                i18nKey="pending:accounts.approve.currency"
                options={{ count: nbCurrencies }}
              />
            </Text>
          </div>
          <LineSeparator />
        </Fragment>
      )}
      {accounts.map(account => (
        <Link
          className={classnames(classes.row, "test-pending-account", {
            [classes.approved]: approved,
          })}
          to={`${match.url}/account/${account.id}`}
          key={account.id}
        >
          <div className={classes.dateContainer}>
            <span className={classes.date}>
              <DateFormat date={account.created_on} />
            </span>
            <span className={classes.name}>
              <AccountName account={account} />
            </span>
          </div>
          <div className={classes.status}>
            <ApprovalStatus
              approved={account.approvals || []}
              approvers={approvers}
              nbRequired={quorum}
              user={user}
            />
            <span className={classes.currency}>
              {getAccountCurrencyName(account)}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

export default withStyles(styles)(withRouter(PendingAccountApprove));
