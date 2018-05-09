// @flow
import React, { Component } from "react";
import { withStyles } from "material-ui/styles";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import Card from "components/Card";
import CardField from "components/CardField";
import DateFormat from "components/DateFormat";
import type { Account } from "data/types";

const styles = {
  card: {
    height: 218,
    width: "50%"
  },
  title: {
    fontSize: 28
  }
};
class AccountBalanceCard extends Component<{
  account: Account,
  classes: { [_: $Keys<typeof styles>]: string },
  reloading: boolean
}> {
  render() {
    const { account, reloading, classes } = this.props;
    return (
      <Card className={classes.card} reloading={reloading} title="Balance">
        <CardField label={<DateFormat date={new Date()} />}>
          <div className={classes.title}>
            <CurrencyAccountValue account={account} value={account.balance} />
          </div>
        </CardField>
      </Card>
    );
  }
}

export default withStyles(styles)(AccountBalanceCard);
