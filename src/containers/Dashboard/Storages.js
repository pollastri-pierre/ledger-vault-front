//@flow
import React, { Component } from "react";
import connectData from "../../restlay/connectData";
import AccountCard from "./AccountCard";
import AccountsQuery from "../../api/queries/AccountsQuery";
import TryAgain from "../../components/TryAgain";

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

const RenderError = ({ error, restlay }: *) => (
  <TryAgain error={error} action={restlay.forceFetch} />
);

export default connectData(Storages, {
  queries: {
    accounts: AccountsQuery
  },
  optimisticRendering: true,
  RenderError
});
