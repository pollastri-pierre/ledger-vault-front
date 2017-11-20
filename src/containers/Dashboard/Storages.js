//@flow
import React, { Component } from "react";
import connectData from "../../restlay/connectData";
import AccountCard from "./AccountCard";
import AccountsQuery from "../../api/queries/AccountsQuery";

class Storages extends Component<{ accounts: *, filter: * }> {
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
  queries: {
    accounts: AccountsQuery
  },
  optimisticRendering: true
});
