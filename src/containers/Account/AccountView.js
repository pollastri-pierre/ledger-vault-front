// @flow
import React, { Component } from "react";
import _ from "lodash";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import ModalRoute from "../../components/ModalRoute";
import OperationModal from "../../components/operations/OperationModal";
import connectData from "../../restlay/connectData";
import CurrencyAccountValue from "../../components/CurrencyAccountValue";
import CurrencyCounterValueConversion from "../../components/CurrencyCounterValueConversion";
import Card from "../../components/Card";
import DateFormat from "../../components/DateFormat";
import CardField from "../../components/CardField";
import ReceiveFundsCard from "./ReceiveFundsCard";
import DataTableOperation from "../../components/DataTableOperation";
import QuicklookGraph from "./QuicklookGraph";
import { Select, Option } from "../../components/Select";
import AccountOperationsQuery from "../../api/queries/AccountOperationsQuery";
import AccountQuery from "../../api/queries/AccountQuery";
import CurrenciesQuery from "../../api/queries/CurrenciesQuery";
import type { Account, Operation, Currency } from "../../data/types";
import "./Account.css";
import { formatCurrencyUnit } from "../../data/currency";

class AccountView extends Component<
  {
    account: Account,
    operations: Array<Operation>,
    currencies: Array<Currency>,
    reloading: boolean,
    match: {
      url: string,
      params: {
        id: string
      }
    }
  },
  *
> {
  constructor(props) {
    super(props);
    this.state = {
      quickLookGraphFilter: "balance",
      tabsIndex: 0,
      labelDateRange: this.getLabelDateRange(this.getDateRange(0))
    };
  }

  onQuickLookGraphFilterChange = filter => {
    this.setState({ quickLookGraphFilter: filter });
  };

  quickLookGraphFilters = [
    { title: "balance", key: "balance" },
    { title: "countervalue", key: "countervalue" }
  ];

  selectTab = index => {
    this.setState({
      tabsIndex: index,
      labelDateRange: this.getLabelDateRange(this.getDateRange(index))
    });
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

    let res = "";
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
  getDateRange = tabsIndex => {
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

  getOperations = data => {
    const { currencies, account } = this.props;
    const { quickLookGraphFilter } = this.state;
    console.log(data);
    let operations = [];
    if (!data.length) return [];

    operations = data.map((o: Operation) => {
      return {
        time: new Date(o.time),
        amount: o.amount,
        tooltip: true
      };
    });
    console.log("hey");
    console.log(quickLookGraphFilter);
    if (quickLookGraphFilter === "balance") {
      operations = operations.map((o: Operation, i: number): Array<
        Operations
      > => {
        return {
          ...o,
          amount: parseFloat(
            formatCurrencyUnit(
              account.currency.units[0],
              operations.slice(0, i).reduce((a: number, b: Operation) => {
                return a + b.amount;
              }, 0)
            )
          )
        };
      });
      operations.push({
        ...operations[operations.length - 1],
        time: new Date(),
        tooltip: false
      });
    } else if (quickLookGraphFilter === "countervalue") {
      operations = operations.map((o: Operation) => {
        return {
          ...o,
          amount: o.amount * o.currency.rate.value
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
    const { account, operations, reloading, currencies } = this.props;
    const { tabsIndex, quickLookGraphFilter, labelDateRange } = this.state;
    console.log(account);
    const data = this.getOperations(operations);
    return (
      <div className="account-view">
        <div className="account-view-infos">
          <div className="infos-left">
            <div className="infos-left-top">
              <Card reloading={reloading} className="balance" title="Balance">
                <CardField label={<DateFormat date={new Date()} />}>
                  <CurrencyAccountValue
                    account={account}
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
                  label={<CurrencyCounterValueConversion account={account} />}
                >
                  <CurrencyAccountValue
                    account={account}
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
              data.length && (
                <Select onChange={this.onQuickLookGraphFilterChange}>
                  {this.quickLookGraphFilters.map(({ title, key }) => (
                    <Option
                      key={key}
                      value={key}
                      selected={quickLookGraphFilter === key}
                    >
                      {title}
                    </Option>
                  ))}
                </Select>
              )
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
                    currency={account.currency} //FIXME
                  />
                </div>
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
            accounts={[account]}
            operations={operations}
            columnIds={["date", "address", "status", "countervalue", "amount"]}
          />
        </Card>
        <ModalRoute
          path={`${this.props.match.url}/operation/:operationId/:tabIndex`}
          component={OperationModal}
        />
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
  queries: {
    currencies: CurrenciesQuery,
    account: AccountQuery,
    operations: AccountOperationsQuery
  },
  propsToQueryParams: props => ({ accountId: props.match.params.id }),
  RenderError
});
