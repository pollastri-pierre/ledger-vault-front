//@flow
import React, { Component } from 'react';
import type { Account } from '../../datatypes';
import Card from '../../components/Card';
import EvolutionSince from './EvolutionSince';
import CurrencyNameValue from '../../components/CurrencyNameValue';

const Separator = () => <hr />; // FIXME

class AccountCard extends Component<*> {
  props: {
    account: Account,
    filter: string
  };
  render() {
    const { account, filter } = this.props;
    const { reference_conversion } = account;
    return (
      <Card key={account.id} title={account.name}>
        <EvolutionSince
          value={account.balance}
          valueHistory={account.balance_history}
          filter={filter}
        />
        <Separator />
        <div>
          <div>
            <CurrencyNameValue
              currencyName={account.currency.name}
              value={account.balance}
            />
          </div>
          <div>
            <CurrencyNameValue
              currencyName={reference_conversion.currency_name}
              value={reference_conversion.balance}
            />
          </div>
        </div>
      </Card>
    );
  }
}

export default AccountCard;
