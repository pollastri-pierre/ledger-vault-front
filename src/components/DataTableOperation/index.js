//@flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Card from '../Card';
import DateFormat from '../DateFormat';
import CurrencyNameValue from '../CurrencyNameValue';
import AccountName from '../AccountName';
import currencies from '../../currencies';
import type { Operation, Account, Currency } from '../../datatypes';
import DataTable from '../DataTable';
import './index.css';

class DataTableOperation extends Component<*> {
  props: {
    operations: Array<Operation>,
    accounts: Array<Account>,
    columnIds: Array<string>
  };
  render() {
    const { operations, accounts, columnIds } = this.props;
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
        className: 'address',
        title: 'address',
        renderCell: () => <span>TODO</span>
      },
      {
        className: 'status',
        title: 'status',
        renderCell: () => <span>TODO</span>
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
    ].filter(c => columnIds.includes(c.className));
    return <DataTable data={data} columns={columns} />;
  }
}

export default DataTableOperation;
