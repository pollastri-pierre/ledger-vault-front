// @flow
import React, { Component } from "react";
import CounterValues from "components/CounterValues";
import DateFormat from "components/DateFormat";
import { translate } from "react-i18next";
import Card from "components/legacy/Card";
import type { Account, User, Translate } from "data/types";
import CardField from "components/CardField";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  body: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  card: {
    height: "180px",
  },
};

type Props = {
  classes: { [_: $Keys<typeof styles>]: string },
  t: Translate,
  accounts: Array<Account>,
  members: User[],
  reloading: *,
};

class TotalBalance extends Component<Props> {
  render() {
    const { reloading, accounts, t, members, classes } = this.props;
    // nb total of different currencies in all the accounts
    const nbCurrency = [...new Set(accounts.map(account => account.currency))]
      .length;

    return (
      <Card
        reloading={reloading}
        title={t("dashboard:total_balance")}
        className={classes.card}
      >
        <div className={classes.body}>
          <CardField
            label={<DateFormat date={new Date()} />}
            dataTest="dashboard_total_balance"
          >
            <CounterValues accounts={accounts} />
          </CardField>
          <CardField
            label={t("dashboard:accounts")}
            align="right"
            dataTest="dashboard_nb_accounts"
          >
            {accounts.length}
          </CardField>
          <CardField
            label={t("dashboard:currencies")}
            align="right"
            dataTest="dashboard_nb_currencies"
          >
            {nbCurrency}
          </CardField>
          <CardField
            label={t("dashboard:members")}
            align="right"
            dataTest="dashboard_nb_members"
          >
            {members.length}
          </CardField>
        </div>
      </Card>
    );
  }
}

export default withStyles(styles)(translate()(TotalBalance));
