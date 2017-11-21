//@flow
import React, { Component } from "react";
import connectData from "../../restlay/connectData";
import CurrencyFiatValue from "../../components/CurrencyFiatValue";
import EvolutionSince, {
  TotalBalanceFilters
} from "../../components/EvolutionSince";
import DateFormat from "../../components/DateFormat";
import Card from "../../components/Card";
import CardField from "../../components/CardField";
import "./TotalBalanceCard.css";
import { Select, Option } from "../../components/Select";
import TryAgain from "../../components/TryAgain";
import SpinnerCard from "../../components/spinners/SpinnerCard";
import DashboardTotalBalanceQuery from "../../api/queries/DashboardTotalBalanceQuery";

class TotalBalance extends Component<{
  totalBalance: *,
  filter: string,
  onTotalBalanceFilterChange: (filter: string) => void,
  reloading: *,
  restlay: *
}> {
  render() {
    const {
      onTotalBalanceFilterChange,
      filter,
      totalBalance,
      reloading
    } = this.props;
    return (
      <Card
        reloading={reloading}
        className="total-balance"
        title="total balance"
        titleRight={
          <Select onChange={onTotalBalanceFilterChange}>
            {TotalBalanceFilters.map(({ key, title }) => (
              <Option key={key} value={key} selected={filter === key}>
                {title}
              </Option>
            ))}
          </Select>
        }
      >
        <div className="body">
          <CardField label={<DateFormat date={totalBalance.date} />}>
            <CurrencyFiatValue
              fiat={totalBalance.currencyName}
              value={totalBalance.value}
            />
          </CardField>
          <EvolutionSince
            value={totalBalance.value}
            valueHistory={totalBalance.valueHistory}
            filter={TotalBalanceFilters.find(f => f.key === filter)}
          />
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

const RenderError = ({ error, restlay }: *) => (
  <Card className="total-balance" title="total balance">
    <TryAgain error={error} action={restlay.forceFetch} />
  </Card>
);

const RenderLoading = () => (
  <Card className="total-balance" title="total balance">
    <SpinnerCard />
  </Card>
);

export default connectData(TotalBalance, {
  queries: {
    totalBalance: DashboardTotalBalanceQuery
  },
  optimisticRendering: true,
  RenderError,
  RenderLoading
});
