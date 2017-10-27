//@flow
import React, { Component } from 'react';
import AccountCard from './AccountCard';

class Storages extends Component<{ accounts: *, filter: string }> {
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

export default Storages;
