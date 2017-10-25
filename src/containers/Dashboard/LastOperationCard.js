//@flow
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Card from '../../components/Card';
import type { Operation } from '../../datatypes';

class LastOperationCard extends Component<*> {
  props: {
    operations: Array<Operation>
  };
  render() {
    const { operations } = this.props;
    return (
      <Card
        title="last operations"
        titleRight={<Link to="TODO">VIEW ALL</Link>}
      >
        {operations.map(op => <div key={op.id}>{op.currency_name}</div>)}
      </Card>
    );
  }
}

export default LastOperationCard;
