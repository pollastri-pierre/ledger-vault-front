//@flow
import React from "react";
import { withStyles } from "material-ui/styles";
import { Link } from "react-router-dom";
import CurrencyAccountValue from "../CurrencyAccountValue";
import classnames from "classnames";
import CurrencyFiatValue from "../CurrencyFiatValue";
import DateFormat from "../DateFormat";
import ApprovalStatusWithAccountName from "./ApprovalStatusWithAccountName";
import { countervalueForRate } from "../../data/currency";
import type { Account, Operation, Member } from "../../data/types";
import styles from "./styles";

type Props = {
  accounts: Account[],
  operations: Operation[],
  approved?: boolean,
  user: Member,
  classes: Object
};

function PendingOperationApprove(props: Props) {
  const { accounts, operations, approved, user, classes } = props;
  if (operations.length === 0) {
    return <p>There are no operations to approve</p>;
  }

  let totalAmount = {
    fiat: operations[0].rate.fiat,
    value: operations.reduce(
      (sum, op) => countervalueForRate(op.rate, op.amount).value + sum,
      0
    )
  };

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
            <CurrencyFiatValue {...totalAmount} />
          </p>
          <p className={classnames(classes.header, classes.headerLight)}>
            <span>pending approval</span>
            <span>TODAY, 10:45 AN</span>
          </p>
        </div>
      )}
      {operations.map(operation => {
        const account = accounts.find(a => a.id === operation.account_id);
        return (
          <Link
            className={classnames(classes.row, {
              [classes.approved]: approved
            })}
            to={`/pending/operation/${operation.uuid}`}
            key={operation.uuid}
          >
            <div>
              <span className={classes.date}>
                <DateFormat date={operation.time} />
              </span>
              <span className={classes.name}>
                {!account ? null : (
                  <CurrencyAccountValue
                    account={account}
                    value={operation.amount}
                  />
                )}
              </span>
              <span className={classnames(classes.currency, "center")}>
                {!account ? null : (
                  <CurrencyAccountValue
                    account={account}
                    value={operation.amount}
                    rate={operation.rate}
                    countervalue
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

export default withStyles(styles)(PendingOperationApprove);
