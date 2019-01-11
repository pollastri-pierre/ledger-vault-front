// @flow
import { withStyles } from "@material-ui/core/styles";
import CounterValue from "components/CounterValue";
import React, { Component } from "react";
import CurrencyCounterValueConversion from "components/CurrencyCounterValueConversion";
import { translate } from "react-i18next";
import Card from "components/Card";
import CardField from "components/CardField";
import type { Account, Translate } from "data/types";
import colors from "shared/colors";

const styles = {
  card: {
    color: colors.lead,
    marginLeft: 10,
    width: "50%"
  }
};
class AccountCountervalueCard extends Component<{
  account: Account,
  reloading: boolean,
  t: Translate,
  classes: Object
}> {
  render() {
    const { account, reloading, classes, t } = this.props;
    return (
      <Card
        className={classes.card}
        reloading={reloading}
        title={t("accountView:countervalue")}
      >
        <CardField label={<CurrencyCounterValueConversion account={account} />}>
          <CounterValue value={account.balance} from={account.currency_id} />
        </CardField>
      </Card>
    );
  }
}

export default withStyles(styles)(translate()(AccountCountervalueCard));
