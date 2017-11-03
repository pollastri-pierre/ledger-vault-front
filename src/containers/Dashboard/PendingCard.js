//@flow
import React, { Component } from "react";
import connectData from "../../decorators/connectData";
import api from "../../data/api-spec";
import ViewAllLink from "../../components/ViewAllLink";
import Card from "../../components/Card";
import CardField from "../../components/CardField";
import CardLoading from "../../components/utils/CardLoading";
import DateFormat from "../../components/DateFormat";
import CurrencyNameValue from "../../components/CurrencyNameValue";
import AccountName from "../../components/AccountName";
import type { Operation, Account } from "../../datatypes";
import "./PendingCard.css";

const Row = ({ date, children }) => (
  <div className="pending-list-row">
    <div className="date uppercase">
      <DateFormat date={date} />
    </div>
    <div className="body">{children}</div>
  </div>
);

const OperationRow = ({ data }: { data: Operation }) => (
  <Row date={data.time}>
    <CurrencyNameValue currencyName={data.currency_name} value={data.amount} />
  </Row>
);
const AccountRow = ({ data }: { data: Account }) => (
  <Row date={data.time}>
    <AccountName name={data.name} currency={data.currency} />
  </Row>
);

const PendingCardRowPerType = {
  operation: OperationRow,
  account: AccountRow
};

class PendingCard extends Component<{
  pendings: *,
  accounts: *,
  reloading: boolean
}> {
  render() {
    const {
      pendings: { approveOperations, approveAccounts },
      reloading
    } = this.props;
    const events = approveOperations
      .map(data => ({ type: "operation", data }))
      .concat(approveAccounts.map(data => ({ type: "account", data })));
    const totalOperations = approveOperations.length;
    const totalAccounts = approveAccounts.length;
    const total = totalOperations + totalAccounts;
    return (
      <Card
        reloading={reloading}
        title="pending"
        titleRight={<ViewAllLink to="/pending">VIEW ALL ({total})</ViewAllLink>}
        className="pendingCard"
      >
        <header className="pendingHeader">
          <CardField label="operations" align="center">
            {totalOperations}
          </CardField>
          <CardField label="account" align="center">
            {totalAccounts}
          </CardField>
        </header>
        <div className="pending-list">
          {events.map((o, i) => {
            const Row = PendingCardRowPerType[o.type];
            return <Row key={i} {...o} />;
          })}
        </div>
      </Card>
    );
  }
}

class RenderError extends Component<*> {
  render() {
    return <Card title="pending" className="pendingCard" />;
  }
}

class RenderLoading extends Component<*> {
  render() {
    return (
      <Card title="pending" className="pendingCard">
        <CardLoading />
      </Card>
    );
  }
}

export default connectData(PendingCard, {
  api: {
    accounts: api.accounts,
    pendings: api.pendings
  },
  RenderError,
  RenderLoading
});
