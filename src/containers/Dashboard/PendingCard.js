//@flow
import React, { Component } from "react";
import ViewAllLink from "../../components/ViewAllLink";
import Card from "../../components/Card";
import CardField from "../../components/CardField";
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

class PendingCard extends Component<{ pending: * }> {
  render() {
    const {
      pending: { operations, accounts, total, totalOperations, totalAccounts }
    } = this.props;
    const events = operations
      .map(data => ({ type: "operation", data }))
      .concat(accounts.map(data => ({ type: "account", data })));
    return (
      <Card
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

export default PendingCard;
