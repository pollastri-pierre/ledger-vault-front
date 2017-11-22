//@flow
import React, { Component } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import type { Account, Operation, lineChartPoint } from "../../data/types";
import { getUnitFromRate, getAccountCurrencyUnit } from "../../data/currency";
import { Select, Option } from "../../components/Select";
import DateFormat from "../../components/DateFormat";
import QuicklookGraph from "./QuicklookGraph";
import { formatCurrencyUnit } from "../../data/currency";
import _ from "lodash";
import Card from "../../components/Card";
import AccountQuery from "../../api/queries/AccountQuery";
import AccountOperationsQuery from "../../api/queries/AccountOperationsQuery";
import TryAgain from "../../components/TryAgain";
import SpinnerCard from "../../components/spinners/SpinnerCard";
import connectData from "../../restlay/connectData";

type Props = {
  accountId: string,
  account: Account,
  operations: Array<Operation>,
  reloading: boolean
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
    const max = new Date();
    let min = new Date();
    min =
      tabsIndex === 0
        ? new Date(new Date().setFullYear(new Date().getFullYear() - 1))
        : min;
    min =
      tabsIndex === 1
        ? new Date(new Date().setMonth(new Date().getMonth() - 1))
        : min;
    min = tabsIndex === 2 ? this.getLastWeek() : min;
    min =
      tabsIndex === 3
        ? new Date(new Date().getTime() - 24 * 60 * 60 * 1000)
        : min;
    return [min.setHours(0, 0, 0, 0), max.setHours(0, 0, 0, 0)];
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

  getOperations = (data: Operation[]) => {
    const { account } = this.props;
    const { quicklookFilter } = this.state;
    console.log(quicklookFilter);
    let operations = [];
    if (!data.length) return [];
    //PROBABLY NEEDS TO BE FIXED
    operations = data.map((o: Operation): lineChartPoint => {
      return {
        time: new Date(o.time),
        amount: o.amount,
        tooltip: true,
        rate: o.rate
      };
    });
    if (quicklookFilter === "balance") {
      operations = operations.map(
        ((o: lineChartPoint, i: number): lineChartPoint => {
          return {
            ...o,
            amount: parseFloat(
              formatCurrencyUnit(
                account.currency.units[0],
                operations.slice(0, i).reduce(
                  ((a: number, b: lineChartPoint) => {
                    return a + b.amount;
                  }: Function),
                  0
                ),
                false,
                false,
                false
              )
            )
          };
        }: Function)
      );
      operations.push({
        ...operations[operations.length - 1],
        time: new Date(),
        tooltip: false
      });
    } else if (quicklookFilter === "countervalue") {
      operations = operations.map((o: lineChartPoint) => {
        return {
          ...o,
          amount: o.amount * o.rate.value
        };
      });
      operations.push({
        ...operations[operations.length - 1],
        time: new Date(),
        tooltip: false
      });
    }
    operations = _.sortBy(operations, elem =>
      new Date(elem.time).toISOString()
    );
    return operations;
  };

  render() {
    const { operations, account, reloading } = this.props;
    const data = this.getOperations(operations);
    const { tabsIndex, labelDateRange, quicklookFilter } = this.state;
    let currencyUnit = getAccountCurrencyUnit(account);

    // FIXME PROBABLY NEEDS TO BE FIXED
    if (quicklookFilter === "countervalue") {
      currencyUnit = getUnitFromRate(operations[0].rate);
    }

    return (
      data.length && (
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
                <Tab> Year </Tab>
                <Tab disabled={false}>month</Tab>
                <Tab disabled={false}>week</Tab>
                <Tab disabled={false}>day</Tab>
              </TabList>
            </header>
            <div className="dateLabel">
              From {labelDateRange[0]} to {labelDateRange[1]}
            </div>
            <div className="content">
              <div className="quickLookGraphWrap">
                <QuicklookGraph
                  dateRange={this.getDateRange(tabsIndex)}
                  data={data}
                  currencyUnit={currencyUnit}
                  currencyColor={account.currency.color}
                />
              </div>
              <TabPanel className="tabs_panel" />
              <TabPanel className="tabs_panel" />
              <TabPanel className="tabs_panel" />
              <TabPanel className="tabs_panel" />
            </div>
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
    account: AccountQuery,
    operations: AccountOperationsQuery
  },
  propsToQueryParams: ({ accountId }: { accountId: string }) => ({ accountId }),
  optimisticRendering: true,
  RenderError,
  RenderLoading
});
