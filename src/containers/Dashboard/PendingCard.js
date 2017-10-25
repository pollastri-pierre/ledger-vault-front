//@flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import type { PendingEvent } from '../../datatypes';

const OperationRow = ({ data }) => <div>{data.currency_name}</div>;
const AccountRow = ({ data }) => <div>{data.name}</div>;

const PendingCardRowPerType = {
  operation: OperationRow,
  account: AccountRow
};

class PendingCard extends Component<*> {
  props: {
    events: Array<PendingEvent>,
    total: number
  };
  render() {
    const { events, total } = this.props;
    return (
      <Card
        title="pending"
        titleRight={<Link to="TODO">VIEW ALL ({total})</Link>}
      >
        {events.map((o, i) => {
          const Row = PendingCardRowPerType[o.type];
          return <Row key={i} {...o} />;
        })}
      </Card>
    );
  }
}

export default PendingCard;
