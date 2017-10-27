import React, { Component } from 'react';
import AccountCard from './AccountCard';
import connectData from '../../decorators/connectData';
import api from '../../data/api-spec';

class Storages extends Component {
  render() {
    const { accounts, filter } = this.props;
    return (
      <div className="storages">
        {accounts.map(a => (
          <AccountCard key={a.id} account={a} filter={filter} />
        ))}
      </div>
    );
  }
}

export default connectData(Storages, {
  api: {
    accounts: api.accounts
  }
});
