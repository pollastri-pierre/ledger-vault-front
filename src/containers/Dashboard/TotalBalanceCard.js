//@flow
import React, { Component } from "react";
import connectData from "restlay/connectData";
import CurrencyFiatValue from "components/CurrencyFiatValue";
import EvolutionSince, { TotalBalanceFilters } from "components/EvolutionSince";
import DateFormat from "components/DateFormat";
import Card from "components/Card";
import CardField from "components/CardField";
import { MenuItem } from "material-ui/Menu";
import BlueSelect from "components/BlueSelect";
import TryAgain from "components/TryAgain";
import SpinnerCard from "components/spinners/SpinnerCard";
import DashboardTotalBalanceQuery from "api/queries/DashboardTotalBalanceQuery";
import { withStyles } from "material-ui/styles";

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
  filter: string,
  onTotalBalanceFilterChange: (filter: string) => void,
  reloading: *,
  restlay: *
}> {
  onTotalBalanceFilterChange = (e: *) => {
    this.props.onTotalBalanceFilterChange(e.target.value);
  };
  render() {
    const { filter, totalBalance, reloading, classes } = this.props;
    return (
      <Card
        reloading={reloading}
        title="total balance"
        className={classes.card}
        titleRight={
          <BlueSelect
            value={filter}
            onChange={this.onTotalBalanceFilterChange}
            disableUnderline
            renderValue={key =>
              (TotalBalanceFilters.find(o => o.key === key) || {}).title}
            style={{ minWidth: 120, textAlign: "right", fontSize: 11 }}
          >
            {TotalBalanceFilters.map(({ title, key }) => (
              <MenuItem
                style={{ color: "#27d0e2" }}
                disableRipple
                key={key}
                value={key}
              >
                <span style={{ color: "black" }}>{title.toUpperCase()}</span>
              </MenuItem>
            ))}
          </BlueSelect>
        }
      >
        <div className={classes.body}>
          <CardField label={<DateFormat date={totalBalance.date} />}>
            <CurrencyFiatValue
              fiat={totalBalance.currencyName}
              value={totalBalance.value}
            />
          </CardField>
          <div style={{ minWidth: "200px" }}>
            <EvolutionSince
              value={totalBalance.value}
              valueHistory={totalBalance.valueHistory}
              filter={TotalBalanceFilters.find(f => f.key === filter)}
            />
          </div>
          <CardField label="accounts" align="right">
            {totalBalance.accountsCount}
          </CardField>
          <CardField label="currencies" align="right">
            {totalBalance.currenciesCount}
          </CardField>
          <CardField label="members" align="right">
            {totalBalance.membersCount}
          </CardField>
        </div>
      </Card>
    );
  }
}

const RenderError = withStyles(styles)(({ error, restlay }: *) => (
  <Card title="total balance">
    <TryAgain error={error} action={restlay.forceFetch} />
  </Card>
));

const RenderLoading = withStyles(styles)(({ classes }) => (
  <Card className={classes.card} title="total balance">
    <SpinnerCard />
  </Card>
));

export default connectData(withStyles(styles)(TotalBalance), {
  queries: {
    totalBalance: DashboardTotalBalanceQuery
  },
  optimisticRendering: true,
  RenderError,
  RenderLoading
});
