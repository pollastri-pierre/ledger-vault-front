// @flow
import React, { Component } from "react";
import connectData from "../../restlay/connectData";
import CurrencyAccountValue from "../../components/CurrencyAccountValue";
import CurrencyCounterValueConversion from "../../components/CurrencyCounterValueConversion";
import Card from "../../components/Card";
import CardField from "../../components/CardField";
import AccountQuery from "../../api/queries/AccountQuery";
import TryAgain from "../../components/TryAgain";
import SpinnerCard from "../../components/spinners/SpinnerCard";
import type { Account } from "../../data/types";

class AccountCountervalueCard extends Component<{
  accountId: string,
  account: Account,
  reloading: boolean
}> {
  render() {
    const { account, reloading } = this.props;
    return (
      <Card reloading={reloading} className="countervalue" title="Countervalue">
        <CardField label={<CurrencyCounterValueConversion account={account} />}>
          <CurrencyAccountValue
            account={account}
            value={account.balance}
            countervalue
          />
        </CardField>
      </Card>
    );
  }
}

const RenderError = ({ error, restlay }: *) => (
  <Card className="countervalue" title="Countervalue">
    <TryAgain error={error} action={restlay.forceFetch} />
  </Card>
);

const RenderLoading = () => (
  <Card className="countervalue" title="Countervalue">
    <SpinnerCard />
  </Card>
);

export default connectData(AccountCountervalueCard, {
  queries: {
    account: AccountQuery
  },
  propsToQueryParams: ({ accountId }: { accountId: string }) => ({ accountId }),
  optimisticRendering: true,
  RenderError,
  RenderLoading
});
