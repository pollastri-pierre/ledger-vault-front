//@flow
import React, { Component } from "react";
import queryString from "query-string";
// import OperationDetails from "../../components/operations/OperationDetails";
import { Route } from "react-router";
import Card from "../../components/Card";
import Currencies from "./Currencies";
import { TotalBalanceFilters } from "../../components/TotalBalanceFilter";
import TotalBalanceCard from "./TotalBalanceCard";
import LastOperationCard from "./LastOperationCard";
import PendingCard from "./PendingCard";
import Storages from "./Storages";
import type { Filter } from "./EvolutionSince";

import "./index.css";

class Dashboard extends Component<*> {
  onTotalBalanceFilterChange = (filter: Filter) => {
    this.props.history.replace({
      search: "?filter=" + filter.key
    });
  };

  render() {
    const { location } = this.props;
    const { onTotalBalanceFilterChange } = this;
    const { filter } = queryString.parse(location.search.slice(1));
    const filterObj =
      TotalBalanceFilters.find(f => f.key === filter) || TotalBalanceFilters[0];

    return (
      <div id="dashboard">
        <div className="body">
          <TotalBalanceCard
            filter={filterObj}
            onTotalBalanceFilterChange={onTotalBalanceFilterChange}
          />
          <LastOperationCard />
          <Storages filter={filterObj} />
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
