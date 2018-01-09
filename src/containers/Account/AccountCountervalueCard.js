// @flow
import { withStyles } from "material-ui/styles";
import React, { Component } from "react";
import connectData from "restlay/connectData";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import CurrencyCounterValueConversion from "components/CurrencyCounterValueConversion";
import Card from "components/Card";
import CardField from "components/CardField";
import AccountQuery from "api/queries/AccountQuery";
import TryAgain from "components/TryAgain";
import SpinnerCard from "components/spinners/SpinnerCard";
import type { Account } from "data/types";
import colors from "shared/colors";

const styles = {
  card: {
    color: colors.lead,
    height: "161px"
  }
};
class AccountCountervalueCard extends Component<{
  accountId: string,
  account: Account,
  reloading: boolean,
  classes: Object
}> {
  render() {
    const { account, reloading, classes } = this.props;
    return (
      <Card className={classes.card} reloading={reloading} title="Countervalue">
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
  <Card title="Countervalue">
    <TryAgain error={error} action={restlay.forceFetch} />
  </Card>
);

const RenderLoading = withStyles(styles)(({ classes }) => (
  <Card className={classes.card} title="Countervalue">
    <SpinnerCard />
  </Card>
));

export default connectData(withStyles(styles)(AccountCountervalueCard), {
  queries: {
    account: AccountQuery
  },
  propsToQueryParams: ({ accountId }: { accountId: string }) => ({ accountId }),
  optimisticRendering: true,
  RenderError,
  RenderLoading
});
