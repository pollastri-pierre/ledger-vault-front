// @flow
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import CurrencyAccountValue from "components/CurrencyAccountValue";
import Card from "components/legacy/Card";
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
type Props = {
  account: Account,
  t: Translate,
  classes: { [_: $Keys<typeof styles>]: string },
  reloading: boolean
};

class AccountBalanceCard extends Component<Props> {
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
            <CurrencyAccountValue
              account={account}
              value={account.balance}
              erc20Format={account.account_type === "ERC20"}
            />
          </div>
        </CardField>
      </Card>
    );
  }
}

export default withStyles(styles)(translate()(AccountBalanceCard));
