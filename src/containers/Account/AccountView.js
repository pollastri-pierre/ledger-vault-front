//@flow
import React, { Component } from "react";
import connectData from "../../decorators/connectData";
import api from "../../data/api-spec";
import CurrencyNameValue from "../../components/CurrencyNameValue";
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

class AccountView extends Component<
  {
    account: Account,
    operations: Array<Operation>
  },
  *
> {
  constructor(props) {
    super(props);
    this.state = {
      quickLookGraphFilter: this.quickLookGraphFilters[0],
      tabsIndex: 0
    };
  }

  onQuickLookGraphFilterChange = filter => {
    this.setState({ quickLookGraphFilter: filter });
  };

  quickLookGraphFilters = [
    { title: "balance", key: "balance" },
    { title: "countervalue", key: "countervalue" },
    { title: "payments", key: "payments" }
  ];

  selectTab = index => {
    this.setState({ tabsIndex: index });
  };

  render() {
    const { account, operations } = this.props;
    const { tabsIndex, quickLookGraphFilter } = this.state;
    const beginDate = "March, 13th";
    const endDate = "19th, 2017";
    return (
      <div className="account-view">
        <div className="account-view-infos">
          <div className="infos-left">
            <div className="infos-left-top">
              <Card className="balance" title="Balance">
                <CardField label={<DateFormat date={new Date()} />}>
                  <CurrencyNameValue
                    currencyName={account.currency.name}
                    value={account.balance}
                  />
                </CardField>
              </Card>

              <Card className="countervalue" title="Countervalue">
                <CardField
                  label={`ETH 1 ≈ ${account.reference_conversion
                    .currency_name} ???`}
                >
                  <CurrencyNameValue
                    currencyName={account.reference_conversion.currency_name}
                    value={account.reference_conversion.balance}
                  />
                </CardField>
              </Card>
            </div>
            <ReceiveFundsCard hash={account.receive_address} />
          </div>
          <Card
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
              <div className="content">
                <TabPanel className="tabs_panel">
                  <div className="dateLabel">
                    {`From ${beginDate} to ${endDate}`}
                  </div>
                  <QuicklookGraph
                    labelHeader={`From ${beginDate} to ${endDate}`}
                    data={operations.map((o: Operation) => ({
                      time: new Date(o.time),
                      amount: o.amount,
                      currency: o.currency
                    }))}
                  />
                </TabPanel>
                <TabPanel className="tabs_panel">
                  <div className="dateLabel">
                    {`From ${beginDate} to ${endDate}`}
                  </div>
                  <QuicklookGraph
                    data={operations.map((o: Operation) => ({
                      time: new Date(o.time),
                      amount: o.amount,
                      currency: o.currency
                    }))}
                  />
                </TabPanel>
                <TabPanel className="tabs_panel">
                  <div className="dateLabel">
                    {`From ${beginDate} to ${endDate}`}
                  </div>
                  <QuicklookGraph
                    data={operations.map((o: Operation) => ({
                      time: new Date(o.time),
                      amount: o.amount,
                      currency: o.currency
                    }))}
                  />
                </TabPanel>
                <TabPanel className="tabs_panel">
                  <div className="dateLabel">
                    {`From ${beginDate} to ${endDate}`}
                  </div>
                  <QuicklookGraph
                    data={operations.map((o: Operation) => ({
                      time: new Date(o.time),
                      amount: o.amount,
                      currency: o.currency
                    }))}
                  />
                </TabPanel>
              </div>
            </Tabs>
          </Card>
        </div>
        <Card
          title="last operations"
          titleRight={
            <span>
              VIEW ALL{/* TODO make that a component, use react-router <Link> */}
            </span>
          }
        >
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
  api: { account: api.account, operations: api.accountOperations },
  propsToApiParams: props => ({ accountId: props.match.params.id }),
  RenderError
});
