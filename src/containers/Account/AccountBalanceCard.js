// @flow
import React, { Component } from "react";
import { withStyles } from "material-ui/styles";
import connectData from "../../restlay/connectData";
import CurrencyAccountValue from "../../components/CurrencyAccountValue";
import Card from "../../components/Card";
import CardField from "../../components/CardField";
import AccountQuery from "../../api/queries/AccountQuery";
import DateFormat from "../../components/DateFormat";
import TryAgain from "../../components/TryAgain";
import SpinnerCard from "../../components/spinners/SpinnerCard";
import type { Account } from "../../data/types";

const styles = {
  card: {
    height: "162px"
  }
};
class AccountBalanceCard extends Component<{
  accountId: string,
  account: Account,
  reloading: boolean
}> {
  render() {
    const { account, reloading, classes } = this.props;
    return (
      <Card className={classes.card} reloading={reloading} title="Balance">
        <CardField label={<DateFormat date={new Date()} />}>
          <CurrencyAccountValue account={account} value={account.balance} />
        </CardField>
      </Card>
    );
  }
}

const RenderError = withStyles(styles)(({ error, restlay, classes }: *) => (
  <Card className={classes.card} title="Balance">
    <TryAgain error={error} action={restlay.forceFetch} />
  </Card>
));

const RenderLoading = withStyles(styles)(({ classes }) => (
  <Card className={classes.card} title="Balance">
    <SpinnerCard />
  </Card>
));

export default connectData(withStyles(styles)(AccountBalanceCard), {
  queries: {
    account: AccountQuery
  },
  propsToQueryParams: ({ accountId }: { accountId: string }) => ({ accountId }),
  optimisticRendering: true,
  RenderError,
  RenderLoading
});
