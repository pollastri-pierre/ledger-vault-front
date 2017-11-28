//@flow
import React, { Component } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import type { Account, Operation, BalanceEntity } from "../../data/types";
import { getUnitFromRate, getAccountCurrencyUnit } from "../../data/currency";
import { Select, Option } from "../../components/Select";
import DateFormat from "../../components/DateFormat";
import QuicklookWrap from "./QuickLookWrap";
import Card from "../../components/Card";
import AccountQuery from "../../api/queries/AccountQuery";
import TryAgain from "../../components/TryAgain";
import SpinnerCard from "../../components/spinners/SpinnerCard";
import connectData from "../../restlay/connectData";

type Props = {
  accountId: string,
  account: Account,
  operations: Array<Operation>,
  balance: BalanceEntity
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

  onQuicklookFilterChange = (filterTitle: string): void => {
    this.setState({
      quicklookFilter: quicklookFilters.find(elem => elem.key === filterTitle)
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

  render() {
    const { operations, account, balance, reloading, accountId } = this.props;
    const { tabsIndex, labelDateRange, quicklookFilter } = this.state;
    let currencyUnit = getAccountCurrencyUnit(account);
    const selectedBalance =
      quicklookFilter === "balance" ? "balance" : "counterValueBalance";
    // FIXME PROBABLY NEEDS TO BE FIXED
    if (quicklookFilter === "countervalue") {
      currencyUnit = getUnitFromRate(operations[0].rate);
    }
    return (
      selectedBalance.length && (
        <Card
          reloading={reloading}
          className="quicklook"
          title="Quicklook"
          titleRight={
            <Select onChange={this.onQuicklookFilterChange}>
              {quicklookFilters.map(({ title, key }) => (
                <Option
                  key={key}
                  value={key}
                  selected={quicklookFilter.key === key}
                >
                  {title}
                </Option>
              ))}
            </Select>
          }
        >
          <Tabs
            className=""
            selectedIndex={tabsIndex}
            onSelect={this.selectTab}
          >
            <header>
              <TabList>
                <Tab> Year {}</Tab>
                <Tab disabled={false}>month</Tab>
                <Tab disabled={false}>week</Tab>
                <Tab disabled={false}>day</Tab>
              </TabList>
            </header>
            <div className="dateLabel">
              From {labelDateRange[0]} to {labelDateRange[1]}
            </div>
            <QuicklookWrap
              accountId={accountId}
              filter={
                quicklookFilter.key === "balance"
                  ? "balance"
                  : "counterValueBalance"
              }
              granularity={tabsIndex}
              dateRange={this.getDateRange(tabsIndex)}
              currencyUnit={currencyUnit}
              currencyColor={account.currency.color}
            />
            <TabPanel className="tabs_panel" />
            <TabPanel className="tabs_panel" />
            <TabPanel className="tabs_panel" />
            <TabPanel className="tabs_panel" />
          </Tabs>
        </Card>
      )
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
