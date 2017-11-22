// @flow
import React, { Component } from "react";
import connectData from "../../restlay/connectData";
import CurrencyAccountValue from "../../components/CurrencyAccountValue";
import Card from "../../components/Card";
import CardField from "../../components/CardField";
import AccountQuery from "../../api/queries/AccountQuery";
import DateFormat from "../../components/DateFormat";
import TryAgain from "../../components/TryAgain";
import SpinnerCard from "../../components/spinners/SpinnerCard";
import type { Account } from "../../data/types";

class AccountBalanceCard extends Component<{
  accountId: string,
  account: Account,
  reloading: boolean
}> {
  render() {
    const { account, reloading } = this.props;
    return (
      <Card reloading={reloading} className="balance" title="Balance">
        <CardField label={<DateFormat date={new Date()} />}>
          <CurrencyAccountValue account={account} value={account.balance} />
        </CardField>
      </Card>
    );
  }
}

const RenderError = ({ error, restlay }: *) => (
  <Card className="balance" title="Balance">
    <TryAgain error={error} action={restlay.forceFetch} />
  </Card>
);

const RenderLoading = () => (
  <Card className="balance" title="Balance">
    <SpinnerCard />
  </Card>
);

export default connectData(AccountBalanceCard, {
  queries: {
    account: AccountQuery
  },
  propsToQueryParams: ({ accountId }: { accountId: string }) => ({ accountId }),
  optimisticRendering: true,
  RenderError,
  RenderLoading
});
