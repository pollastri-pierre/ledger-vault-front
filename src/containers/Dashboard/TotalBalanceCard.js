//@flow
import React, { Component } from "react";
// import EvolutionSince, { TotalBalanceFilters } from "components/EvolutionSince";
import CounterValues from "components/CounterValues";
import DateFormat from "components/DateFormat";
import { translate } from "react-i18next";
import Card from "components/Card";
import type { Account, Member, Translate } from "data/types";
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
  t: Translate,
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
      t,
      members,
      classes
    } = this.props;
    // nb total of different currencies in all the accounts
    const nbCurrency = [
      ...new Set(accounts.map(account => account.currency_id))
    ].length;

    return (
      <Card
        reloading={reloading}
        title={t("dashboard:total_balance")}
        className={classes.card}
      >
        <div className={classes.body}>
          <CardField
            label={<DateFormat date={new Date()} />}
            dataTest="dashboard_total_balance"
          >
            <CounterValues accounts={accounts} />
          </CardField>
          <div style={{ minWidth: "200px" }}>
            {/* <EvolutionSince */}
            {/*   value={totalBalance.value} */}
            {/*   valueHistory={totalBalance.valueHistory} */}
            {/*   filter={TotalBalanceFilters.find(f => f.key === filter)} */}
            {/* /> */}
          </div>
          <CardField
            label={t("dashboard:accounts")}
            align="right"
            dataTest="dashboard_nb_accounts"
          >
            {accounts.length}
          </CardField>
          <CardField
            label={t("dashboard:currencies")}
            align="right"
            dataTest="dashboard_nb_currencies"
          >
            {nbCurrency}
          </CardField>
          <CardField
            label={t("dashboard:members")}
            align="right"
            dataTest="dashboard_nb_members"
          >
            {members.length}
          </CardField>
        </div>
      </Card>
    );
  }
}

export default withStyles(styles)(translate()(TotalBalance));
