//@flow
import React from "react";
import { Trans } from "react-i18next";
import { withStyles } from "@material-ui/core/styles";
import OperationsCounterValues from "components/CounterValues/OperationsCounterValues";
import CounterValue from "components/CounterValue";
import { Link } from "react-router-dom";
import CurrencyAccountValue from "../CurrencyAccountValue";
import classnames from "classnames";
import { withRouter } from "react-router";
import DateFormat from "../DateFormat";
import ApprovalStatusWithAccountName from "./ApprovalStatusWithAccountName";
import type { Account, Operation, Member } from "data/types";
import styles from "./styles";

const Empty = ({ approved }: { approved?: boolean }) =>
  approved ? (
    <p>
      <Trans i18nKey="pending:operations.watch.no_data" />
    </p>
  ) : (
    <p>
      <Trans i18nKey="pending:operations.approve.no_data" />
    </p>
  );

type Props = {
  accounts: Account[],
  operations: Operation[],
  approved?: boolean,
  user: Member,
  classes: Object,
  match: *
};

function PendingOperationApprove(props: Props) {
  const { accounts, operations, approved, user, classes, match } = props;
  if (operations.length === 0) {
    return <Empty approved={approved} />;
  }

  return (
    <div className={classes.base}>
      {!approved && (
        <div>
          <p className={classnames(classes.header, classes.headerBlack)}>
            {operations.length === 1 ? (
              <span>1 operation</span>
            ) : (
              <span>{operations.length} operations</span>
            )}
            <span>
              <OperationsCounterValues
                accounts={accounts}
                operations={operations}
              />
            </span>
          </p>
          <p className={classnames(classes.header, classes.headerLight)}>
            <span>pending approval</span>
            <span style={{ opacity: 0 }}>TODAY, 10:45 AN</span>
          </p>
        </div>
      )}
      {operations.map(operation => {
        const account = accounts.find(a => a.id === operation.account_id);
        return (
          <Link
            data-test="pending-operation"
            className={classnames(classes.row, {
              [classes.approved]: approved
            })}
            to={`${match.url}/operation/${operation.id}`}
            key={operation.id}
          >
            <div>
              <span className={classes.date}>
                <DateFormat date={operation.created_on} />
              </span>
              <span className={classes.name}>
                {!account ? null : (
                  <CurrencyAccountValue
                    account={account}
                    value={operation.price.amount}
                  />
                )}
              </span>
              <span className={classnames(classes.currency, "center")}>
                {!account ? null : (
                  <CounterValue
                    value={operation.price.amount}
                    from={account.currency.name}
                  />
                )}
              </span>
            </div>
            {account ? (
              <ApprovalStatusWithAccountName
                user={user}
                operation={operation}
                account={account}
              />
            ) : null}
          </Link>
        );
      })}
    </div>
  );
}

export default withStyles(styles)(withRouter(PendingOperationApprove));
