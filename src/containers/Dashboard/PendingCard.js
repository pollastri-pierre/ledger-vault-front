//@flow
import React, { Component } from "react";
import connectData from "../../restlay/connectData";
import ViewAllLink from "../../components/ViewAllLink";
import Card from "../../components/Card";
import CardField from "../../components/CardField";
import DateFormat from "../../components/DateFormat";
import CurrencyAccountValue from "../../components/CurrencyAccountValue";
import AccountName from "../../components/AccountName";
import type { Operation, Account } from "../../data/types";
import AccountsQuery from "../../api/queries/AccountsQuery";
import PendingsQuery from "../../api/queries/PendingsQuery";
import TryAgain from "../../components/TryAgain";
import SpinnerCard from "../../components/spinners/SpinnerCard";
import type { Response as PendingsQueryResponse } from "../../api/queries/PendingsQuery";
import "./PendingCard.css";

const Row = ({
  date,
  children
}: {
  date: string,
  children: React$Node | string
}) => (
  <div className="pending-list-row">
    <div className="date">
      <DateFormat date={date} />
    </div>
    <div className="body">{children}</div>
  </div>
);

const OperationRow = ({
  operation,
  account
}: {
  operation: Operation,
  account: ?Account
}) =>
  account ? (
    <Row date={operation.time}>
      <CurrencyAccountValue account={account} value={operation.amount} />
    </Row>
  ) : null;

const AccountRow = ({ account }: { account: Account }) => (
  <Row date={account.creation_time}>
    <AccountName name={account.name} currency={account.currency} />
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
                operation={operation}
                account={accounts.find(a => a.id === operation.account_id)}
              />
            ))
            .concat(
              approveAccounts.map((account, i) => (
                <AccountRow key={"ac_" + i} account={account} />
              ))
            )}
        </div>
      </Card>
    );
  }
}

const RenderError = ({ error, restlay }: *) => (
  <Card title="pending" className="pendingCard">
    <TryAgain error={error} action={restlay.forceFetch} />
  </Card>
);

const RenderLoading = () => (
  <Card title="pending" className="pendingCard">
    <SpinnerCard />
  </Card>
);

export default connectData(PendingCard, {
  queries: {
    accounts: AccountsQuery,
    pendings: PendingsQuery
  },
  optimisticRendering: true,
  RenderError,
  RenderLoading
});
