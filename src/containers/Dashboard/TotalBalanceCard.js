//@flow
import React, { Component } from "react";
// import EvolutionSince, { TotalBalanceFilters } from "components/EvolutionSince";
import CounterValues from "components/CounterValues";
import DateFormat from "components/DateFormat";
import Card from "components/Card";
import type { Account, Member } from "data/types";
import CardField from "components/CardField";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  body: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between"
  },
  card: {
    height: "180px"
  }
};
class TotalBalance extends Component<{
  classes: { [_: $Keys<typeof styles>]: string },
  totalBalance: *,
  accounts: Array<Account>,
  members: Member[],
  filter: string,
  onTotalBalanceFilterChange: (filter: string) => void,
  reloading: *,
  restlay: *
}> {
  onTotalBalanceFilterChange = (e: *) => {
    this.props.onTotalBalanceFilterChange(e.target.value);
  };
  render() {
    const {
      // filter,
      // totalBalance,
      reloading,
      accounts,
      members,
      classes
    } = this.props;
    // nb total of different currencies in all the accounts
    const nbCurrency = [
      ...new Set(accounts.map(account => account.currency.name))
    ].length;

    return (
      <Card
        reloading={reloading}
        title="total balance"
        className={classes.card}
      >
        <div className={classes.body}>
          <CardField label={<DateFormat date={new Date()} />}>
            <CounterValues accounts={accounts} />
          </CardField>
          <div style={{ minWidth: "200px" }}>
            {/* <EvolutionSince */}
            {/*   value={totalBalance.value} */}
            {/*   valueHistory={totalBalance.valueHistory} */}
            {/*   filter={TotalBalanceFilters.find(f => f.key === filter)} */}
            {/* /> */}
          </div>
          <CardField label="accounts" align="right">
            {accounts.length}
          </CardField>
          <CardField label="currencies" align="right">
            {nbCurrency}
          </CardField>
          <CardField label="members" align="right">
            {members.length}
          </CardField>
        </div>
      </Card>
    );
  }
}

export default withStyles(styles)(TotalBalance);
