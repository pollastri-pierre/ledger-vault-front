import _ from 'lodash';
import React from 'react';
import { SpinnerCard } from '../../components';
import PieChart from './PieChart';

function Currencies(props) {
  const { accounts, loading } = props;
  console.log(accounts)
  //compute currencies from accounts balance
  const computedCurrencies = _.reduce(accounts, (currencies, account) => {
    const currency_name = account.currency.name;
    const balance = account.balance;
    //check if currency already added
    if (_.isNil(currencies[currency_name]))
    {
      currencies[currency_name] = {
                                    meta : account.currency,
                                    balance: 0,
                                  }
    }
    currencies[currency_name].balance += balance
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
      { // TODO we will move up the loading handling and assume here accounts is loaded
        (loading || _.isNull(accounts)) ?
          <SpinnerCard />
        :
        <PieChart data={data} />
      }
    </div>
  );
}

export default Currencies;
