//@flow
import React, { Component } from "react";
import Card from "../../components/Card";
import Currencies from "./Currencies";
import TotalBalanceCard from "./TotalBalanceCard";
import LastOperationCard from "./LastOperationCard";
import PendingCard from "./PendingCard";
import Storages from "./Storages";
import type { Filter } from "./EvolutionSince";

import "./index.css";

class Dashboard extends Component<{}, { filter: Filter }> {
  state = {
    filter: { title: "yesterday", key: "yesterday" }
  };

  onTotalBalanceFilterChange = (filter: Filter) => {
    this.setState({ filter });
  };

  render() {
    const { filter } = this.state;
    const { onTotalBalanceFilterChange } = this;

    return (
      <div id="dashboard">
        <div className="body">
          <TotalBalanceCard
            filter={filter}
            onTotalBalanceFilterChange={onTotalBalanceFilterChange}
          />
          <LastOperationCard />
          <Storages filter={filter} />
        </div>
        <div className="aside">
          <Card title="currencies">
            <Currencies />
          </Card>
          <PendingCard />
        </div>
      </div>
    );
  }
}

export default Dashboard;
