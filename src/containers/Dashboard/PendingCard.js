//@flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import DashboardField from './DashboardField';
import DateFormat from '../../components/DateFormat';
import CurrencyNameValue from '../../components/CurrencyNameValue';
import AccountName from '../../components/AccountName';
import type { PendingEvent } from '../../datatypes';
import './PendingCard.css';

const Row = ({ date, children }) => (
  <div className="row">
    <div className="date">
      <DateFormat date={date} />
    </div>
    <div className="body">{children}</div>
  </div>
);

const OperationRow = ({ data }) => (
  <Row date={data.time}>
    <CurrencyNameValue currencyName={data.currency_name} value={data.amount} />
  </Row>
);
const AccountRow = ({ data }) => (
  <Row date={data.time}>
    <AccountName name={data.name} currency={data.currency} />
  </Row>
);

const PendingCardRowPerType = {
  operation: OperationRow,
  account: AccountRow
};

class PendingCard extends Component<*> {
  props: {
    events: Array<PendingEvent>,
    total: number,
    totalOperations: number,
    totalAccounts: number
  };
  render() {
    const { events, total, totalOperations, totalAccounts } = this.props;
    return (
      <Card
        title="pending"
        titleRight={<Link to="TODO">VIEW ALL ({total})</Link>}
      >
        <header>
          <DashboardField label="operations" align="center">
            {totalOperations}
          </DashboardField>
          <DashboardField label="account" align="center">
            {totalAccounts}
          </DashboardField>
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
