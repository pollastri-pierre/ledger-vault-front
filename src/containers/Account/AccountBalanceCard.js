// @flow
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import Card from "components/Card";
import { translate } from "react-i18next";
import CardField from "components/CardField";
import DateFormat from "components/DateFormat";
import type { Account, Translate } from "data/types";

const styles = {
  card: {
    width: "50%"
  },
  title: {
    fontSize: 28
  }
};
class AccountBalanceCard extends Component<{
  account: Account,
  t: Translate,
  classes: { [_: $Keys<typeof styles>]: string },
  reloading: boolean
}> {
  render() {
    const { account, reloading, classes, t } = this.props;
    return (
      <Card
        className={classes.card}
        reloading={reloading}
        title={t("accountView:balance")}
      >
        <CardField label={<DateFormat date={new Date()} />}>
          <div className={classes.title}>
            <CurrencyAccountValue account={account} value={account.balance} />
          </div>
        </CardField>
      </Card>
    );
  }
}

export default withStyles(styles)(translate()(AccountBalanceCard));
