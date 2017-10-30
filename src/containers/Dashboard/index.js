//@flow
import React, { Component } from "react";
import { Link } from "react-router-dom";
import connectData from "../../decorators/connectData";
import api from "../../data/api-spec";

import Card from "../../components/Card";
import Currencies from "./Currencies";
import TotalBalanceCard from "./TotalBalanceCard";
import LastOperationCard from "./LastOperationCard";
import PendingCard from "./PendingCard";
import Storages from "./Storages";

import "./index.css";

class Dashboard extends Component<
  { dashboard: *, accounts: * },
  { filter: string }
> {
  state = {
    filter: "yesterday"
  };

  onTotalBalanceFilterChange = (filter: string) => {
    this.setState({ filter });
  };

  render() {
    const { dashboard, accounts } = this.props;
    const { filter } = this.state;
    const { onTotalBalanceFilterChange } = this;

    return (
      <div id="dashboard">
        <div className="body">
          <TotalBalanceCard
            totalBalance={dashboard.totalBalance}
            filter={filter}
            onTotalBalanceFilterChange={onTotalBalanceFilterChange}
          />
          <LastOperationCard
            operations={dashboard.lastOperations}
            accounts={accounts}
          />
          <Storages accounts={accounts} filter={filter} />
        </div>
        <div className="aside">
          <Card title="currencies">
            <Currencies accounts={accounts} />
          </Card>
          <PendingCard pending={dashboard.pending} />
        </div>
      </div>
    );
  }
}

export default connectData(Dashboard, {
  api: {
    dashboard: api.dashboard,
    accounts: api.accounts,
    members: api.members
  }
});
