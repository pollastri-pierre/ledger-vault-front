//@flow
import React from "react";
import { Link } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import LineRow from "../LineRow";
import AccountName from "../AccountName";
import DateFormat from "../DateFormat";
import OperationStatus from "components/OperationStatus";
import OverviewOperation from "../OverviewOperation";
import Amount from "../Amount";
import type { Operation, Account } from "data/types";

const styles = {
  operationList: {
    marginTop: "8px"
  }
};

function TabOverview(props: {
  operation: Operation,
  account: Account,
  classes: Object
}) {
  const { operation, account, classes } = props;
  return (
    <div>
      <OverviewOperation
        amount={operation.amount || operation.price.amount}
        account={account}
        operationType={operation.type}
      />
      <div className={classes.operationList}>
        <LineRow label="Identifier">
          {operation.transaction.hash && (
            <span>{operation.transaction.hash}</span>
          )}
        </LineRow>
        <LineRow label="status">
          <OperationStatus operation={operation} />
        </LineRow>

        <LineRow label="send date">
          <DateFormat date={operation.created_on} />
        </LineRow>
        <LineRow label="account">
          <Link
            style={{ textDecoration: "none", color: "black" }}
            to={`/account/${account.id}`}
          >
            <AccountName name={account.name} currency={account.currency} />
          </Link>
        </LineRow>
        <LineRow label="fees">
          <Amount account={account} value={operation.fees} />
        </LineRow>
        <LineRow label="Total spent">
          <Amount
            account={account}
            value={operation.amount || operation.price.amount}
            strong
          />
        </LineRow>
      </div>
    </div>
  );
}

export default withStyles(styles)(TabOverview);
