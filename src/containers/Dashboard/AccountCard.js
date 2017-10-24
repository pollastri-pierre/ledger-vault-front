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
    const { balance } = account;
    return (
      <Card key={account.id} title={account.name}>
        <EvolutionSince
          value={balance.value}
          valueHistory={balance.valueHistory}
          filter={filter}
        />
        <Separator />
        <div>
          <div>
            <CurrencyNameValue
              currencyName={balance.currencyName}
              value={balance.value}
            />
          </div>
          <div>
            <CurrencyNameValue
              currencyName={balance.referenceConversion.currencyName}
              value={balance.referenceConversion.value}
            />
          </div>
        </div>
      </Card>
    );
  }
}

export default AccountCard;
