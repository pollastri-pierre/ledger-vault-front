//@flow
import React, { Component } from "react";
import Card from "../../components/Card";
import Currencies from "./Currencies";
import { TotalBalanceFilters } from "../../components/EvolutionSince";
import TotalBalanceCard from "./TotalBalanceCard";
import LastOperationCard from "./LastOperationCard";
import PendingCard from "./PendingCard";
import Storages from "./Storages";
import OperationModal from "../../components/operations/OperationModal";
import ModalRoute from "../../components/ModalRoute";

class Dashboard extends Component<
  {
    match: *,
    location: *,
    history: *
  },
  {
    filter: string
  }
> {
  state = {
    filter: TotalBalanceFilters[0].key
  };

  onTotalBalanceFilterChange = (filter: string) => {
    this.setState({ filter });
  };

  render() {
    const { match } = this.props;
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
        <ModalRoute
          path={`${match.url}/operation/:operationId/:tabIndex`}
          component={OperationModal}
        />
      </div>
    );
  }
}

export default Dashboard;
