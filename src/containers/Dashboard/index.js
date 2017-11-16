//@flow
import React, { Component } from "react";
import queryString from "query-string";
import Card from "../../components/Card";
import Currencies from "./Currencies";
import { TotalBalanceFilters } from "../../components/EvolutionSince";
import TotalBalanceCard from "./TotalBalanceCard";
import LastOperationCard from "./LastOperationCard";
import PendingCard from "./PendingCard";
import Storages from "./Storages";
import OperationModal from "../../components/operations/OperationModal";
import ModalRoute from "../../components/ModalRoute";

import "./index.css";

class Dashboard extends Component<{
  match: *,
  location: *,
  history: *
}> {
  onTotalBalanceFilterChange = (filter: string) => {
    this.props.history.replace({
      search: "?filter=" + filter
    });
  };

  render() {
    const { location, match } = this.props;
    const { onTotalBalanceFilterChange } = this;
    const { filter } = queryString.parse(location.search.slice(1));
    const filterObj = filter || TotalBalanceFilters[0].key;

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

        <ModalRoute
          path={`${match.url}/operation/:operationId/:tabIndex`}
          component={OperationModal}
        />
      </div>
    );
  }
}

export default Dashboard;
