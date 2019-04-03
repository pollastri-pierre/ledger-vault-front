// @flow
import React, { Fragment } from "react";
import { BigNumber } from "bignumber.js";
import { Trans, Interpolate } from "react-i18next";
import { Link } from "react-router-dom";
import classnames from "classnames";
import { withRouter } from "react-router";
import { withStyles } from "@material-ui/core/styles";
import OperationsCounterValues from "components/CounterValues/OperationsCounterValues";
import CounterValue from "components/CounterValue";
import Text from "components/Text";
import LineSeparator from "components/LineSeparator";

import type { Account, Operation, Member } from "data/types";

import CurrencyAccountValue from "../CurrencyAccountValue";
import DateFormat from "../DateFormat";
import ApprovalStatusWithAccountName from "./ApprovalStatusWithAccountName";
import PendingEmptyState from "./PendingEmptyState";

import styles from "./styles";

const Empty = ({ approved }: { approved?: boolean }) =>
  approved ? (
    <PendingEmptyState
      text={<Trans i18nKey="pending:operations.watch.no_data" />}
    />
  ) : (
    <PendingEmptyState
      text={<Trans i18nKey="pending:operations.approve.no_data" />}
    />
  );

type Props = {
  accounts: Account[],
  operations: Operation[],
  approved?: boolean,
  user: Member,
  classes: { [_: $Keys<typeof styles>]: string },
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
        <Fragment>
          <div className={classes.headerContainer}>
            <Text className={classes.header}>
              <Interpolate
                i18nKey="pending:operations.approve.operation"
                options={{ count: operations.length }}
                numberOfOperations={operations.length}
              />
            </Text>
            <Text className={classes.header}>
              <OperationsCounterValues
                accounts={accounts}
                operations={operations}
              />
            </Text>
          </div>
          <div
            className={classnames(classes.headerContainer, classes.subHeader)}
          >
            <Text small className={classes.subHeader}>
              <Trans i18nKey="pending:operations.approve.status" />
            </Text>
          </div>
          <LineSeparator />
        </Fragment>
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
              {account && (
                <Fragment>
                  <Text small className={classes.currency}>
                    <CounterValue
                      value={
                        operation.price ? operation.price.amount : BigNumber(0)
                      }
                      from={account.currency_id}
                      disableCountervalue={account.account_type === "ERC20"}
                    />
                  </Text>
                  <Text className={classes.name}>
                    <CurrencyAccountValue
                      account={account}
                      value={
                        operation.price ? operation.price.amount : BigNumber(0)
                      }
                      erc20Format={account.account_type === "ERC20"}
                    />
                  </Text>
                </Fragment>
              )}
            </div>
            {account && (
              <ApprovalStatusWithAccountName
                user={user}
                operation={operation}
                account={account}
              />
            )}
          </Link>
        );
      })}
    </div>
  );
}

export default withStyles(styles)(withRouter(PendingOperationApprove));
