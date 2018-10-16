//@flow
import React from "react";
import { Link } from "react-router-dom";
import LineRow from "../LineRow";
import AccountName from "../AccountName";
import DateFormat from "../DateFormat";
import ConfirmationStatus from "../ConfirmationStatus";
import OverviewOperation from "../OverviewOperation";
import Amount from "../Amount";
import type { Operation, Account } from "data/types";

function TabOverview(props: { operation: Operation, account: Account }) {
  const { operation, account } = props;
  return (
    <div>
      <OverviewOperation
        hash={operation.transaction.hash}
        amount={operation.amount}
        account={account}
      />
      <div className="operation-list">
        <LineRow label="status">
          <ConfirmationStatus nbConfirmations={operation.confirmations} />
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
          <Amount account={account} value={operation.amount} strong />
        </LineRow>
      </div>
    </div>
  );
}

export default TabOverview;
