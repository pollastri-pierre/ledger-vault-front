//@flow
import React, { Component } from 'react';
import BadgeCurrency from '../BadgeCurrency';
import type { Currency } from '../../datatypes';
import './index.css';

class AccountName extends Component<*> {
  props: {
    name: string,
    currency: Currency
  };
  render() {
    const { name, currency } = this.props;
    return (
      <span className="account-name">
        <BadgeCurrency currency={currency} />
        <span className="name">{name}</span>
      </span>
    );
  }
}

export default AccountName;
