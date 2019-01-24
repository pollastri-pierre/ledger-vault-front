// @flow
import React from "react";
import { Trans } from "react-i18next";
import { Link } from "react-router-dom";
import classnames from "classnames";
import { withRouter } from "react-router";
import { withStyles } from "@material-ui/core/styles";
import OperationsCounterValues from "components/CounterValues/OperationsCounterValues";
import CounterValue from "components/CounterValue";
import Text from "components/Text";

import type { Account, Operation, Member } from "data/types";

import CurrencyAccountValue from "../CurrencyAccountValue";
import DateFormat from "../DateFormat";
import ApprovalStatusWithAccountName from "./ApprovalStatusWithAccountName";
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
  // NOTE: needs some refactor, it is very sloppy
  return (
    <div className={classes.base}>
      {!approved && (
        <div>
          <p className={classnames(classes.header, classes.headerBlack)}>
            <Trans
              i18nKey={
                operations.length === 1
                  ? "pending:operations.approve.operation_singular"
                  : "pending:operations.approve.operation_plural"
              }
              values={{ numbeOfOperations: operations.length }}
            />
            <span>
              <OperationsCounterValues
                accounts={accounts}
                operations={operations}
              />
            </span>
          </p>
          <p style={{ padding: 0 }} className={classnames(classes.headerLight)}>
            <span>
              <Trans i18nKey="pending:operations.approve.status" />
            </span>
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
            <div className={classes.operationDetailsContainer}>
              <span className={classes.date}>
                <DateFormat date={operation.created_on} />
              </span>
              <Text small className={classes.currency}>
                {account && (
                  <CounterValue
                    value={operation.price.amount}
                    from={account.currency_id}
                    disableCountervalue={account.account_type === "ERC20"}
                  />
                )}
              </Text>
              <Text className={classes.name}>
                {account && (
                  <CurrencyAccountValue
                    account={account}
                    value={operation.price.amount}
                    erc20Format={account.account_type === "ERC20"}
                  />
                )}
              </Text>
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
