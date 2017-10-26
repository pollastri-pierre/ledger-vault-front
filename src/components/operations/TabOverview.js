import _ from 'lodash';
import React from 'react';
import ArrowDown from '../icons/ArrowDown';
import ValidateBadge from '../icons/ValidateBadge';
import LineRow from '../LineRow';
import AccountName from '../AccountName';
import DateFormat from '../DateFormat';
import ConfirmationStatus from '../ConfirmationStatus';
import OverviewOperation from '../OverviewOperation';
import Amount from '../Amount';

function TabOverview(props) {
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
        amount_flat={operation.reference_conversion.amount}
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
            amount_crypto={operation.fees}
            amount_flat={operation.reference_conversion.fees}
            currencyName={account.currency.name}
          />
        </LineRow>
        <LineRow label="Total spent">
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

export default TabOverview;
