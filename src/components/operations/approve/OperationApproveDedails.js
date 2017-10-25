import _ from 'lodash';
import React from 'react';
import ArrowDown from '../../icons/ArrowDown';
import PropTypes from 'prop-types';
import LineRow from '../../LineRow';
import AccountName from '../../AccountName';
import DateFormat from '../../DateFormat';
import ConfirmationStatus from '../../ConfirmationStatus';
import OverviewOperation from '../../OverviewOperation';
import Amount from '../../Amount';

function OperationApproveDetails(props) {
  const {operation, accounts} = props;

  const account = _.find(
    accounts,
    account => account.id === operation.account_id,
  );
  return (
    <div>
      <OverviewOperation
        hash="1F1tAaz5x1HUXrCNLbtMDqcw6o5GNn4xqX"
        amount={operation.amount}
        currency={account.currency.name}
        amount_flat={operation.amount_flat}
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
            amount_crypto={operation.fees}
            amount_flat={operation.fees_flat}
            currencyName={account.currency.name}
          />
        </LineRow>
        <LineRow label="Total Spent">
          <Amount
            amount_crypto={operation.amount}
            amount_flat={operation.amount_flat}
            currencyName={account.currency.name}
            strong
          />
        </LineRow>
      </div>
    </div>
  );
}

OperationApproveDetails.propTypes = {
  operation: PropTypes.shape({}),
};

export default OperationApproveDetails;
