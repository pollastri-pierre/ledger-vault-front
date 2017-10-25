//@flow
import React, {Component} from 'react';
import CurrencyNameValue from '../CurrencyNameValue';
import type {Unit} from '../datatypes';
import './index.css';

class Amount extends Component<*> {
  props: {
    amount_crypto: number,
    amount_flat: number,
    strong: boolean,
    unit: Unit,
  };

  render() {
    const {currencyName, amount_flat, amount_crypto, strong} = this.props;

    return (
      <span className={`${strong ? 'amount-strong' : ''}`}>
        <CurrencyNameValue
          currencyName={currencyName}
          value={amount_crypto}
        />{' '}
        <span className="flat-amount">
          (<CurrencyNameValue currencyName="EUR" value={amount_flat} />)
        </span>
      </span>
    );
  }
}

export default Amount;
