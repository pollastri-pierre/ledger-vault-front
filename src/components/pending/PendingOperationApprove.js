//@flow
import React from "react";
import { Link } from "react-router-dom";
import _ from "lodash";
import AccountName from "../AccountName";
import CurrencyUnitValue from "../CurrencyUnitValue";
import CurrencyNameValue from "../CurrencyNameValue";
import DateFormat from "../DateFormat";
import ApprovalStatus from "../ApprovalStatus";
import { countervalueForRate } from "../../data/currency";
import type { Operation, Member } from "../../datatypes";

type Props = {
  operations: Array<Operation>,
  approved?: boolean,
  user: Member
};
function PendingOperationApprove(props: Props) {
  const { operations, approved, user } = props;
  if (operations.length === 0) {
    return <p>There are no operations to approve</p>;
  }

  let totalAmountCurrency = operations[0].rate.currency_name;
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
        const account = operation.account;
        const amountUnitValue = countervalueForRate(
          operation.rate,
          operation.amount
        );

        return (
          <Link
            className={`pending-request operation ${approved ? "watch" : ""}`}
            to={`/pending/operation/${account.id}`}
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
            <div>
              <ApprovalStatus
                approved={operation.approved}
                approvers={account.security_scheme.approvers}
                nbRequired={account.security_scheme.quorum}
                user_hash={user.pub_key}
              />
              <AccountName name={account.name} currency={account.currency} />
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default PendingOperationApprove;
