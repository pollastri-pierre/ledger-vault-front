import React from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import ValidateBadge from "../icons/ValidateBadge";
import AccountName from "../AccountName";
import CurrencyNameValue from "../CurrencyNameValue";
import DateFormat from "../DateFormat";
import ApprovalStatus from "../ApprovalStatus";

function PendingOperationApprove(props) {
  const { operations, open, approved, accounts, approvers, user } = props;
  if (operations.length === 0) {
    return <p>There are no operations to approve</p>;
  }

  // const totalAmount = '-EUR 15,256.89';
  const totalAmount = _.reduce(
    operations,
    (sum, op) => op.reference_conversion.amount + sum,
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

            <CurrencyNameValue currencyName="EUR" value={totalAmount} />
          </p>
          <p className="header light">
            <span>pending approval</span>
            <span>TODAY, 10:45 AN</span>
          </p>
        </div>
      )}
      {_.map(operations, operation => {
        const currencyClass = operation.currency_name.toLowerCase();
        const account = _.find(
          accounts,
          account => account.id === operation.account_id
        );

        return (
          <div
            className={`pending-request operation ${approved ? "watch" : ""}`}
            key={operation.uuid}
            onClick={() => open("operation", operation, approved)}
          >
            <div>
              <span className="request-date-creation">
                <DateFormat date={operation.time} />
              </span>
              <span className="request-operation-amount crypto">
                <CurrencyNameValue
                  currencyName="BTC"
                  value={operation.amount}
                />
              </span>
              <span className="request-operation-amount">
                <CurrencyNameValue
                  currencyName="EUR"
                  value={operation.reference_conversion.amount}
                />
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
          </div>
        );
      })}
    </div>
  );
}

PendingOperationApprove.defaultProps = {
  approved: false,
  approvers: []
};

PendingOperationApprove.propTypes = {
  operations: PropTypes.arrayOf(
    PropTypes.shape({
      uuid: PropTypes.string,
      name: PropTypes.string
    })
  ).isRequired,
  accounts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string
    })
  ).isRequired,
  open: PropTypes.func.isRequired,
  approved: PropTypes.bool,
  approvers: PropTypes.arrayOf(PropTypes.shape({}))
};

export default PendingOperationApprove;
