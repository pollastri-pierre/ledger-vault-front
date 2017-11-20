//@flow
import React, { Component } from "react";
import connectData from "../../restlay/connectData";
import ViewAllLink from "../../components/ViewAllLink";
import Card from "../../components/Card";
import CardField from "../../components/CardField";
import CardLoading from "../../components/utils/CardLoading";
import DateFormat from "../../components/DateFormat";
import CurrencyAccountValue from "../../components/CurrencyAccountValue";
import AccountName from "../../components/AccountName";
import type { Operation, Account } from "../../data/types";
import AccountsQuery from "../../api/queries/AccountsQuery";
import PendingsQuery from "../../api/queries/PendingsQuery";
import type { Response as PendingsQueryResponse } from "../../api/queries/PendingsQuery";
import "./PendingCard.css";

const Row = ({
  date,
  children
}: {
  date: string,
  children: React$Element<*>
}) => (
  <div className="pending-list-row">
    <div className="date">
      <DateFormat date={date} />
    </div>
    <div className="body">{children}</div>
  </div>
);

const OperationRow = ({
  data,
  account
}: {
  data: Operation,
  account: ?Account
}) =>
  account ? (
    <Row date={data.time}>
      <CurrencyAccountValue account={account} value={data.amount} />
    </Row>
  ) : null;

const AccountRow = ({ data }: { data: Account }) => (
  <Row date={data.creation_time}>
    <AccountName name={data.name} currency={data.currency} />
  </Row>
);

class PendingCard extends Component<{
  pendings: PendingsQueryResponse,
  accounts: Account[],
  reloading: boolean
}> {
  render() {
    const {
      accounts,
      pendings: { approveOperations, approveAccounts },
      reloading
    } = this.props;
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
          {approveOperations
            .map((operation, i) => (
              <OperationRow
                key={"op_" + i}
                data={operation}
                account={accounts.find(a => a.id === operation.account_id)}
              />
            ))
            .concat(
              approveAccounts.map((account, i) => (
                <AccountRow key={"ac_" + i} data={account} />
              ))
            )}
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
  queries: {
    accounts: AccountsQuery,
    pendings: PendingsQuery
  },
  optimisticRendering: true,
  RenderError,
  RenderLoading
});
