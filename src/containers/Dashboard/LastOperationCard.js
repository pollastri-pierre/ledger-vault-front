//@flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import DateFormat from '../../components/DateFormat';
import CurrencyNameValue from '../../components/CurrencyNameValue';
import AccountName from '../../components/AccountName';
import currencies from '../../currencies';
import type { Operation, Account, Currency } from '../../datatypes';
import './LastOperationCard.css';

class OperationRow extends Component<*> {
  props: {
    operation: Operation,
    accounts: Array<Account>
  };
  render() {
    const { operation, accounts } = this.props;
    const account: ?Account = accounts.find(a => a.id === operation.account_id);
    const currency: ?Currency = currencies.find(
      c => c.name === operation.currency_name
    );
    return (
      <tr>
        <td className="date">
          <DateFormat date={operation.time} />
        </td>
        <td className="name">
          {account &&
            currency && <AccountName name={account.name} currency={currency} />}
        </td>
        <td className="countervalue">
          <CurrencyNameValue
            currencyName={operation.reference_conversion.currency_name}
            value={operation.reference_conversion.amount}
          />
        </td>
        <td className="amount">
          <CurrencyNameValue
            currencyName={operation.currency_name}
            value={operation.amount}
          />
        </td>
      </tr>
    );
  }
}

class LastOperationCard extends Component<*> {
  props: {
    operations: Array<Operation>,
    accounts: Array<Account>
  };
  render() {
    const { operations, accounts } = this.props;
    return (
      <Card
        title="last operations"
        titleRight={<Link to="TODO">VIEW ALL</Link>}
      >
        <table className="operations">
          <thead>
            <tr>
              <th className="date">date</th>
              <th className="account">account</th>
              <th className="countervalue" />
              <th className="amount">amount</th>
            </tr>
          </thead>
          <tbody>
            {operations.map(op => (
              <OperationRow key={op.id} operation={op} accounts={accounts} />
            ))}
          </tbody>
        </table>
      </Card>
    );
  }
}

export default LastOperationCard;
