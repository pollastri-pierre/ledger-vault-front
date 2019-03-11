// @flow
import UsersQuery from "api/queries/UsersQuery";
import SpinnerCard from "components/spinners/SpinnerCard";
import type { Account, Member } from "data/types";
import DashboardPlaceholder from "components/DashboardPlaceholder";
import connectData from "restlay/connectData";
import React, { Component } from "react";
import AccountsQuery from "api/queries/AccountsQuery";
import Card from "components/legacy/Card";
import OperationModal from "components/operations/OperationModal";
import ModalRoute from "components/ModalRoute";
import { withStyles } from "@material-ui/core/styles";
import Currencies from "./Currencies";
import TotalBalanceCard from "./TotalBalanceCard";
import LastOperationCard from "./LastOperationCard";
import PendingCard from "./PendingCard";
import Storages from "./Storages";

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

type Props = {
  classes: { [_: $Keys<typeof styles>]: string },
  match: *,
  accounts: Array<Account>,
  users: Array<Member>
};

class Dashboard extends Component<Props> {
  render() {
    const { match, classes, accounts, users } = this.props;

    // TODO handle the case where accounts exist but no transaction
    if (accounts.length === 0) {
      return <DashboardPlaceholder type="account" />;
    }
    const hasMoney = accounts.filter(account => account.balance > 0).length > 0;
    return (
      <div className={classes.base}>
        <div className={classes.body}>
          <TotalBalanceCard members={users} accounts={accounts} />
          <LastOperationCard />
          <Storages />
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
    users: UsersQuery,
    accounts: AccountsQuery
  },
  RenderLoading
});
