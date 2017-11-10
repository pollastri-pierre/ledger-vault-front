//@flow
import React, { Component } from "react";
import connectData from "../../restlay/connectData";
import * as api from "../../data/api-spec";
import CurrencyNameValue from "../../components/CurrencyNameValue";
import CurrencyCounterValueConversion from "../../components/CurrencyCounterValueConversion";
import Card from "../../components/Card";
import DateFormat from "../../components/DateFormat";
import CardField from "../../components/CardField";
import ReceiveFundsCard from "./ReceiveFundsCard";
import DataTableOperation from "../../components/DataTableOperation";
import QuicklookGraph from "./QuicklookGraph";
import type { Account, Operation } from "../../datatypes";
import CustomSelectField from "../../components/CustomSelectField/CustomSelectField.js";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "./Account.css";
import _ from "lodash";

class AccountView extends Component<
  {
    account: Account,
    operations: Array<Operation>,
    reloading: boolean
  },
  *
> {
  constructor(props) {
    super(props);
    this.state = {
      quickLookGraphFilter: this.quickLookGraphFilters[0],
      tabsIndex: 0,
      labelDateRange: this.getLabelDateRange(this.getDateRange(this.tabsIndex))
    };
  }

  onQuickLookGraphFilterChange = filter => {
    this.setState({ quickLookGraphFilter: filter });
  };

  onDomainChange = domain => {
    this.setState({ labelDateRange: this.getLabelDateRange(domain) });
  };

  quickLookGraphFilters = [
    { title: "balance", key: "balance" },
    { title: "countervalue", key: "countervalue" },
    { title: "payments", key: "payments" }
  ];

  selectTab = index => {
    this.setState({ tabsIndex: index });
  };
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

  getLabelDateRange = domain => {
    const timeDelta = domain[1] - domain[0];

    const dateRange =
      timeDelta <= 86400000
        ? "day"
        : timeDelta <= 2629746000
          ? "month"
          : timeDelta <= 31556952000 ? "year" : "hour";

    let res = "";
    if (dateRange === "day") {
      //Same day
      res = [
        <DateFormat date={domain[0]} format="MMMM Do, YYYY h:mm" />,
        <DateFormat date={domain[1]} format="h:mm" />
      ];
    } else if (dateRange === "month") {
      //Same month
      res = [
        <DateFormat date={domain[0]} format="MMMM Do" />,
        <DateFormat date={domain[1]} format="Do, YYYY" />
      ];
    } else if (dateRange === "year") {
      //Same year
      res = [
        <DateFormat date={domain[0]} format="MMMM Do" />,
        <DateFormat date={domain[1]} format="MMMM Do, YYYY" />
      ];
    } else
      res = [
        <DateFormat date={domain[0]} format="MMMM Do, YYYY" />,
        <DateFormat date={domain[1]} format="MMMM Do, YYYY" />
      ];
    return res;
  };
  getDateRange = tabsIndex => {
    const max = new Date().setHours(0, 0, 0, 0);
    let min = new Date().setHours(0, 0, 0, 0);
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

    return [min, max];
  };

  getOperations = data => {
    data = data.map((o: Operation) => ({
      time: new Date(o.time),
      amount: o.amount,
      currency: o.currency,
      tooltip: true
    }));
    data.push({ ...data[data.length - 1] });
    data[data.length - 1].time = new Date().setHours(0, 0, 0, 0);
    data[data.length - 1].tooltip = false;
    _.sortBy(data, elem => new Date(elem.time).toISOString());
    return data;
  };

  render() {
    const { account, operations, reloading } = this.props;
    const { tabsIndex, quickLookGraphFilter, labelDateRange } = this.state;
    const dateRange = this.getDateRange(dateRange);
    console.log("rendering accountView");
    return (
      <div className="account-view">
        <div className="account-view-infos">
          <div className="infos-left">
            <div className="infos-left-top">
              <Card reloading={reloading} className="balance" title="Balance">
                <CardField label={<DateFormat date={new Date()} />}>
                  <CurrencyNameValue
                    currencyName={account.currency.name}
                    value={account.balance}
                  />
                </CardField>
              </Card>

              <Card
                reloading={reloading}
                className="countervalue"
                title="Countervalue"
              >
                <CardField
                  label={
                    <CurrencyCounterValueConversion
                      currencyName={account.currency.name}
                    />
                  }
                >
                  <CurrencyNameValue
                    currencyName={account.currency.name}
                    value={account.balance}
                    countervalue
                  />
                </CardField>
              </Card>
            </div>
            <ReceiveFundsCard hash={account.receive_address} />
          </div>
          <Card
            reloading={reloading}
            className="quicklook"
            title="Quicklook"
            titleRight={
              <CustomSelectField
                values={this.quickLookGraphFilters}
                selected={quickLookGraphFilter}
                onChange={this.onQuickLookGraphFilterChange}
              />
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
                <QuicklookGraph
                  onDomainChange={this.onDomainChange}
                  minDomain={this.getDateRange(0)}
                  dateRange={this.getDateRange(tabsIndex)}
                  data={this.getOperations(operations)}
                />
                <TabPanel className="tabs_panel" />
                <TabPanel className="tabs_panel" />
                <TabPanel className="tabs_panel" />
                <TabPanel className="tabs_panel" />
              </div>
            </Tabs>
          </Card>
        </div>
        <Card reloading={reloading} title="last operations">
          <DataTableOperation
            operations={operations}
            columnIds={["date", "address", "status", "countervalue", "amount"]}
          />
        </Card>
      </div>
    );
  }
}

// FIXME have a generic component for screen errors
const RenderError = ({ error }: { error: Error }) => (
  <span style={{ color: "#fff" }}>
    {(error && error.message) || error.toString()}
  </span>
);

export default connectData(AccountView, {
  queries: { account: api.account, operations: api.accountOperations },
  propsToQueryParams: props => ({ accountId: props.match.params.id }),
  RenderError
});
