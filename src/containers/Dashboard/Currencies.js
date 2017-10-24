import _ from 'lodash';
import React from 'react';
import { SpinnerCard } from '../../components';
import PieChart from './PieChart';

function Currencies(props) {
  const { accounts, loading } = props;

  const computedCurrencies = _.reduce(accounts, (currencies, account) => {
    const currency = account.currency.name;
    const balance = account.balance;
    currencies[currency] = !_.isNil(currencies[currency]) ? (currencies[currency] + balance) : balance;
    return currencies;
  }, {})
  
  let data = [];
  
  for (let [key, value] of Object.entries(computedCurrencies)) {
    let currency = {
      label : key,
      value : value,
    };
    data.push(currency)
  }
  console.log(data)
  
  //_.isNull(accounts) should display empty chart not loading ?? 

  return (
    <div className="currencies">
      { (loading || _.isNull(accounts)) ?
          <SpinnerCard />
        :
        <PieChart data={data} />
      }
    </div>
  );
}

export default Currencies;

