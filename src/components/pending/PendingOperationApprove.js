//@flow
import React from "react";
import { Link } from "react-router-dom";
import _ from "lodash";
import CurrencyUnitValue from "../CurrencyUnitValue";
import CurrencyNameValue from "../CurrencyNameValue";
import DateFormat from "../DateFormat";
import ApprovalStatusWithAccountName from "./ApprovalStatusWithAccountName";
import { countervalueForRate } from "../../data/currency";
import type { Account, Operation, Member } from "../../data/types";

type Props = {
  accounts: Account[],
  operations: Operation[],
  approved?: boolean,
  user: Member
};
function PendingOperationApprove(props: Props) {
  const { accounts, operations, approved, user } = props;
  if (operations.length === 0) {
    return <p>There are no operations to approve</p>;
  }

  let totalAmountCurrency = operations[0].rate.fiat;
  const totalAmountCounterValue = _.reduce(
    operations,
    (sum, op) => countervalueForRate(op.rate, op.amount).value + sum,
    0
  );

  return (
    <div className="pending-request-list">
      {!approved && (
        <div>
          <p className="header dark">
            {operations.length === 1 ? (
              <span>1 operation</span>
            ) : (
              <span>{operations.length} operations</span>
            )}

            <CurrencyNameValue
              currencyName={totalAmountCurrency}
              value={totalAmountCounterValue}
            />
          </p>
          <p className="header light">
            <span>pending approval</span>
            <span>TODAY, 10:45 AN</span>
          </p>
        </div>
      )}
      {operations.map(operation => {
        const amountUnitValue = countervalueForRate(
          operation.rate,
          operation.amount
        );
        const account: ?Account = accounts.find(
          a => a.id === operation.account_id
        );

        return (
          <Link
            className={`pending-request operation ${approved ? "watch" : ""}`}
            to={`/pending/operation/${operation.uuid}`}
            key={operation.uuid}
          >
            <div>
              <span className="request-date-creation">
                <DateFormat date={operation.time} />
              </span>
              <span className="request-operation-amount crypto">
                <CurrencyNameValue
                  currencyName={operation.currency_name}
                  value={operation.amount}
                />
              </span>
              <span className="request-operation-amount">
                <CurrencyUnitValue {...amountUnitValue} />
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

export default PendingOperationApprove;
