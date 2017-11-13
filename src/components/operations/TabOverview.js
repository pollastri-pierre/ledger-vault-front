//@flow
import React from "react";
import LineRow from "../LineRow";
import AccountName from "../AccountName";
import DateFormat from "../DateFormat";
import ConfirmationStatus from "../ConfirmationStatus";
import OverviewOperation from "../OverviewOperation";
import Amount from "../Amount";
import type { Operation, Account } from "../../data/types";

function TabOverview(props: { operation: Operation, account: Account }) {
  const { operation, account } = props;
  const { rate } = operation;
  return (
    <div>
      <OverviewOperation
        hash="1F1tAaz5x1HUXrCNLbtMDqcw6o5GNn4xqX"
        amount={operation.amount}
        currency={account.currency.name}
        rate={rate}
      />
      <div className="operation-list">
        <LineRow label="status">
          <ConfirmationStatus nbConfirmations={operation.confirmations} />
        </LineRow>

        <LineRow label="send date">
          <DateFormat date={operation.time} />
        </LineRow>
        <LineRow label="account">
          <AccountName name={account.name} currency={account.currency} />
        </LineRow>
        <LineRow label="fees">
          <Amount
            value={operation.fees}
            rate={rate}
            currencyName={account.currency.name}
          />
        </LineRow>
        <LineRow label="Total spent">
          <Amount
            value={operation.amount}
            rate={rate}
            currencyName={account.currency.name}
            strong
          />
        </LineRow>
      </div>
    </div>
  );
}

export default TabOverview;
