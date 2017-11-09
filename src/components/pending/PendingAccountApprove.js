//@flow
import React from "react";
import _ from "lodash";
import { Link } from "react-router-dom";
import DateFormat from "../DateFormat";
import AccountName from "../AccountName";
import ApprovalStatus from "../ApprovalStatus";

type Props = {
  accounts: array,
  approved?: boolean,
  approvers: array,
  user: *
};
function PendingAccountApprove(props: Props) {
  const { accounts, approved, approvers, user } = props;
  if (accounts.length === 0) {
    return <p>There are no accounts to approve</p>;
  }

  const nbCurrencies = _.size(
    _.groupBy(accounts, account => account.currency.family)
  );

  return (
    <div className="pending-request-list">
      {!approved && (
        <div>
          <p className="header dark">
            {accounts.length === 1 ? (
              <span>1 account</span>
            ) : (
              <span>{accounts.length} accounts</span>
            )}
            <span>{nbCurrencies}</span>
          </p>
          <p className="header light">
            <span>pending approval</span>
            {nbCurrencies === 1 ? (
              <span>currency</span>
            ) : (
              <span>currencies</span>
            )}
          </p>
        </div>
      )}
      {_.map(accounts, account => {
        return (
          <Link
            className={`pending-request ${approved ? "watch" : ""}`}
            to={`/pending/account/${account.id}`}
            key={account.id}
          >
            <div>
              <span className="request-date-creation">
                <DateFormat date={account.creation_time} />
              </span>
              <span className="request-name">
                <AccountName name={account.name} currency={account.currency} />
              </span>
            </div>
            <div>
              <ApprovalStatus
                approved={account.approved}
                approvers={approvers}
                user_hash={user.pub_key}
              />
              <span className="request-currency">
                {account.currency.family}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

export default PendingAccountApprove;
