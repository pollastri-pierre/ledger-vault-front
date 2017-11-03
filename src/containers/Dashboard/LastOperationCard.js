//@flow
import React, { Component } from "react";
import ViewAllLink from "../../components/ViewAllLink";
import Card from "../../components/Card";
import DataTableOperation from "../../components/DataTableOperation";
import type { Operation, Account } from "../../datatypes";

class LastOperationCard extends Component<*> {
  props: {
    operations: Array<Operation>,
    accounts: Array<Account>
  };
  render() {
    const { operations } = this.props;
    return (
      <Card title="last operations" titleRight={<ViewAllLink to="/search" />}>
        <DataTableOperation
          columnIds={["date", "account", "countervalue", "amount"]}
          operations={operations}
        />
      </Card>
    );
  }
}

export default LastOperationCard;
