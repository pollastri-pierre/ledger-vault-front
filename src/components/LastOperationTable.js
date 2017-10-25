//@flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Card from './Card';
import DateFormat from './DateFormat';
import CurrencyNameValue from './CurrencyNameValue';
import AccountName from './AccountName';
import currencies from '../currencies';
import type { Operation, Account, Currency } from '../datatypes';
import DataTable from './DataTable';

class LastOperationTable extends Component<*> {
  props: {
    operations: Array<Operation>,
    accounts: Array<Account>
  };
  render() {
    const { operations, accounts } = this.props;
    const data = operations.map(operation => {
      const account: ?Account = accounts.find(
        a => a.id === operation.account_id
      );
      const currency: ?Currency = currencies.find(
        c => c.name === operation.currency_name
      );
      return { operation, account, currency };
    });
    const columns = [
      {
        className: 'date',
        title: 'date',
        renderCell: ({ operation }) => <DateFormat date={operation.time} />
      },
      {
        className: 'name',
        title: 'account',
        renderCell: ({ account, currency }) =>
          account &&
          currency && <AccountName name={account.name} currency={currency} />
      },
      {
        className: 'countervalue',
        title: '',
        renderCell: ({ operation }) => (
          <CurrencyNameValue
            currencyName={operation.reference_conversion.currency_name}
            value={operation.reference_conversion.amount}
            alwaysShowSign
          />
        )
      },
      {
        className: 'amount',
        title: 'amount',
        renderCell: ({ operation }) => (
          <CurrencyNameValue
            currencyName={operation.currency_name}
            value={operation.amount}
            alwaysShowSign
          />
        )
      }
    ];
    return <DataTable data={data} columns={columns} />;
  }
}

export default LastOperationTable;
