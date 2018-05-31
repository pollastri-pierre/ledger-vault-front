//@flow
import CurrenciesQuery from "api/queries/CurrenciesQuery";
import MembersQuery from "api/queries/MembersQuery";
import SpinnerCard from "components/spinners/SpinnerCard";
import type { Account, Member } from "data/types";
import DashboardPlaceholder from "components/DashboardPlaceholder";
import connectData from "restlay/connectData";
import React, { Component } from "react";
import AccountsQuery from "api/queries/AccountsQuery";
import Card from "components/Card";
import Currencies from "./Currencies";
import { TotalBalanceFilters } from "components/EvolutionSince";
import TotalBalanceCard from "./TotalBalanceCard";
import LastOperationCard from "./LastOperationCard";
import PendingCard from "./PendingCard";
import Storages from "./Storages";
import OperationModal from "components/operations/OperationModal";
import ModalRoute from "components/ModalRoute";
import { withStyles } from "@material-ui/core/styles";

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
    accounts: Array<Account>,
    members: Array<Member>
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
    const { match, classes, accounts, members } = this.props;
    const { filter } = this.state;
    const { onTotalBalanceFilterChange } = this;

    // TODO handle the case where accounts exist but no transaction
    if (accounts.length === 0) {
      return <DashboardPlaceholder type="account" />;
    }
    const hasMoney = accounts.filter(account => account.balance > 0).length > 0;
    return (
      <div className={classes.base}>
        <div className={classes.body}>
          <TotalBalanceCard
            filter={filter}
            members={members}
            accounts={accounts}
            onTotalBalanceFilterChange={onTotalBalanceFilterChange}
          />
          <LastOperationCard />
          <Storages filter={filter} />
        </div>
        <div className={classes.aside}>
          {hasMoney && (
            <Card title="currencies">
              <Currencies />
            </Card>
          )}
          <PendingCard match={match} />
        </div>
        <ModalRoute
          path={`${match.url}/dashboard/operation/:operationId/:tabIndex`}
          component={OperationModal}
        />
      </div>
    );
  }
}

const RenderLoading = () => <SpinnerCard />;
export default connectData(withStyles(styles)(Dashboard), {
  queries: {
    currencies: CurrenciesQuery,
    members: MembersQuery,
    accounts: AccountsQuery
  },
  RenderLoading
});
