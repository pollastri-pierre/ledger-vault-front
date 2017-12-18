//@flow
import React, { Component } from "react";
import SelectTab from "../../components/SelectTab/SelectTab";
import type { Account } from "../../data/types";
import { getAccountCurrencyUnit, getFiatUnit } from "../../data/currency";
import SelectBubble from "../../components/SelectBubble";
import { MenuItem } from "material-ui/Menu";
import DateFormat from "../../components/DateFormat";
import Quicklook from "./QuickLook";
import Card from "../../components/Card";
import AccountQuery from "../../api/queries/AccountQuery";
import TryAgain from "../../components/TryAgain";
import SpinnerCard from "../../components/spinners/SpinnerCard";
import connectData from "../../restlay/connectData";

type Props = {
  accountId: string,
  account: Account
};

type State = {
  tabsIndex: number,
  quicklookFilter: { title: string, key: string },
  labelDateRange: React$Element<typeof DateFormat>[]
};

type Filter = { title: string, key: string };

const quicklookFilters: Array<Filter> = [
  { title: "balance", key: "balance" },
  { title: "countervalue", key: "countervalue" }
];

export class QuicklookCard extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      tabsIndex: 0,
      quicklookFilter: quicklookFilters[0],
      labelDateRange: this.getLabelDateRange(this.getDateRange(0))
    };
  }

  getLastWeek = () => {
    var today = new Date();
    today.setHours(0, 0, 0, 0);

    var lastWeek = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() - 7
    );
    return lastWeek;
  };

  onQuicklookFilterChange = (e: *): void => {
    this.setState({
      quicklookFilter: quicklookFilters.find(
        elem => elem.key === e.target.value
      )
    });
  };
  selectTab = (index: number): void => {
    this.setState({
      tabsIndex: index,
      labelDateRange: this.getLabelDateRange(this.getDateRange(index))
    });
  };

  getDateRange = (tabsIndex: number): number[] => {
    const dayInMs = 86400000;
    const max = new Date().getTime();
    let min = max;
    min = tabsIndex === 0 ? max - dayInMs * 365 : min;
    min = tabsIndex === 1 ? max - dayInMs * 30 : min;
    min = tabsIndex === 2 ? max - dayInMs * 7 : min;
    min = tabsIndex === 3 ? max - dayInMs : min;
    return [min, max];
  };

  getLabelDateRange = (
    domain: number[]
  ): React$Element<typeof DateFormat>[] => {
    const day1 = new Date(domain[0]).getDate();
    const month1 = new Date(domain[0]).getMonth();
    const year1 = new Date(domain[0]).getFullYear();
    const day2 = new Date(domain[1]).getDate();
    const month2 = new Date(domain[1]).getMonth();
    const year2 = new Date(domain[1]).getFullYear();
    const dateRange =
      day1 === day2 && month1 === month2 && year1 === year2
        ? "day"
        : month1 === month2 && year1 === year2
          ? "month"
          : year1 === year2 ? "year" : "hour";

    let res = [
      <DateFormat key="0" date={domain[0]} format="MMMM Do, YYYY h:mm" />,
      <DateFormat key="1" date={domain[1]} format="h:mm" />
    ];
    if (dateRange === "day") {
      //Same day
      res = [
        <DateFormat key="0" date={domain[0]} format="MMMM Do, YYYY h:mm" />,
        <DateFormat key="1" date={domain[1]} format="h:mm" />
      ];
    } else if (dateRange === "month") {
      //Same month
      res = [
        <DateFormat key="0" date={domain[0]} format="MMMM Do" />,
        <DateFormat key="1" date={domain[1]} format="Do, YYYY" />
      ];
    } else if (dateRange === "year") {
      //Same year
      res = [
        <DateFormat key="0" date={domain[0]} format="MMMM Do" />,
        <DateFormat key="1" date={domain[1]} format="MMMM Do, YYYY" />
      ];
    } else
      res = [
        <DateFormat key="0" date={domain[0]} format="MMMM Do, YYYY" />,
        <DateFormat key="1" date={domain[1]} format="MMMM Do, YYYY" />
      ];
    return res;
  };

  tabsList = ["year", "month", "week", "day"];

  render() {
    const { account, accountId } = this.props;
    const { tabsIndex, labelDateRange, quicklookFilter } = this.state;
    let currencyUnit = getAccountCurrencyUnit(account);
    const filter =
      quicklookFilter.key === "balance" ? "balance" : "counterValueBalance";

    const range = this.tabsList[tabsIndex];
    const dateRange = this.getDateRange(tabsIndex);
    // FIXME PROBABLY NEEDS TO BE FIXED
    if (quicklookFilter.key === "countervalue") {
      currencyUnit = getFiatUnit(account.settings.fiat);
    }
    return (
      <Card
        className="quicklook"
        title="Quicklook"
        titleRight={
          <SelectBubble
            value={quicklookFilter.key}
            onChange={this.onQuicklookFilterChange}
            tickerRight
            arrowDownLeft
            disableUnderline
            style={{ minWidth: 120, textAlign: "right", fontSize: 11 }}
            color="#27d0e2" // FIXME inject theme color
          >
            {quicklookFilters.map(({ title, key }) => (
              <MenuItem
                disableRipple
                style={{ color: "#27d0e2" }}
                key={key}
                value={key}
              >
                <span style={{ color: "black" }}>{title.toUpperCase()}</span>
              </MenuItem>
            ))}
          </SelectBubble>
        }
      >
        <header>
          <SelectTab
            tabs={this.tabsList}
            onChange={this.selectTab}
            selected={tabsIndex}
            theme="header"
          />
        </header>
        <div className="dateLabel">
          From {labelDateRange[0]} to {labelDateRange[1]}
        </div>
        <Quicklook
          accountId={accountId}
          filter={filter}
          range={range}
          dateRange={dateRange}
          currencyUnit={currencyUnit}
          currencyColor={account.currency.color}
          key={accountId + range}
        />
      </Card>
    );
  }
}

const RenderError = ({ error, restlay }: *) => (
  <Card className="quicklook" title="Quicklook">
    <TryAgain error={error} action={restlay.forceFetch} />
  </Card>
);

const RenderLoading = () => (
  <Card className="quicklook" title="Quicklook">
    <SpinnerCard />
  </Card>
);

export default connectData(QuicklookCard, {
  queries: {
    account: AccountQuery
  },
  propsToQueryParams: props => ({
    accountId: props.accountId
  }),
  optimisticRendering: true,
  RenderError,
  RenderLoading
});
