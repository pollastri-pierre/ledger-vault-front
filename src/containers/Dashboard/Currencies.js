import _ from 'lodash';
import React from 'react';
import { SpinnerCard } from '../../components';
import PieChart from './PieChart';

function Currencies(props) {
  const { accounts, loading } = props;
  //compute currencies from accounts balance
  const computedCurrencies = _.reduce(accounts, (currencies, account) => {
    const currency_name = account.currency.name;
    const balance = account.balance;
    //check if currency already added
    if (_.isNil(currencies[currency_name]))
      currencies[currency_name] = { meta : account.currency, balance: 0 }
    currencies[currency_name].balance += balance
    return currencies;
  }, {})
    
  let data = _.reduce(Object.keys(computedCurrencies), (currenciesList, currencies) => {currenciesList.push(computedCurrencies[currencies]); return currenciesList}, [])
  
  return (
    <div className="currencies">
      { (loading) ?
          <SpinnerCard />
        :
        <PieChart data={data} />
      }
    </div>
  );
}

export default Currencies;
