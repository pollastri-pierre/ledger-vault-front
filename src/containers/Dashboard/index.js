//@flow
import React, { Component } from "react";
import Card from "components/Card";
import Currencies from "./Currencies";
import { TotalBalanceFilters } from "components/EvolutionSince";
import TotalBalanceCard from "./TotalBalanceCard";
import LastOperationCard from "./LastOperationCard";
import PendingCard from "./PendingCard";
import Storages from "./Storages";
import OperationModal from "components/operations/OperationModal";
import ModalRoute from "components/ModalRoute";
import { withStyles } from "material-ui/styles";

const styles = {
  base: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap"
  },
  body: {
    flex: "1 1",
    marginRight: "20px",
    minWidth: "680px"
  },
  aside: {
    width: "320px"
  }
};
class Dashboard extends Component<
  {
    classes: { [_: $Keys<typeof styles>]: string },
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
    const { match, classes } = this.props;
    const { filter } = this.state;
    const { onTotalBalanceFilterChange } = this;

    return (
      <div className={classes.base}>
        <div className={classes.body}>
          <TotalBalanceCard
            filter={filter}
            onTotalBalanceFilterChange={onTotalBalanceFilterChange}
          />
          <LastOperationCard />
          <Storages filter={filter} />
        </div>
        <div className={classes.aside}>
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

export default withStyles(styles)(Dashboard);
