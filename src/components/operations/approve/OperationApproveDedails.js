import React from "react";
import PropTypes from "prop-types";
import LineRow from "../../LineRow";
import AccountName from "../../AccountName";
import DateFormat from "../../DateFormat";
import OverviewOperation from "../../OverviewOperation";
import Amount from "../../Amount";

function OperationApproveDetails(props) {
  const { operation } = props;
  const { account } = operation;
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
        <LineRow label="status">Collecting Approvals</LineRow>
        <LineRow label="requested">
          <DateFormat date={operation.time} />
        </LineRow>
        <LineRow label="account to debit">
          <AccountName name={account.name} currency={account.currency} />
        </LineRow>
        <LineRow label="Confirmation fees">
          <Amount
            currencyName={account.currency.name}
            value={operation.fees}
            rate={rate}
          />
        </LineRow>
        <LineRow label="Total Spent">
          <Amount
            currencyName={account.currency.name}
            value={operation.amount}
            rate={rate}
            strong
          />
        </LineRow>
      </div>
    </div>
  );
}

OperationApproveDetails.propTypes = {
  operation: PropTypes.shape({}),
  account: PropTypes.shape({})
};

export default OperationApproveDetails;
