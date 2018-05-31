// @flow
import { withStyles } from "@material-ui/core/styles";
import CounterValue from "components/CounterValue";
import React, { Component } from "react";
import CurrencyCounterValueConversion from "components/CurrencyCounterValueConversion";
import Card from "components/Card";
import CardField from "components/CardField";
import type { Account } from "data/types";
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
  classes: Object
}> {
  render() {
    const { account, reloading, classes } = this.props;
    return (
      <Card className={classes.card} reloading={reloading} title="Countervalue">
        <CardField label={<CurrencyCounterValueConversion account={account} />}>
          <CounterValue value={account.balance} from={account.currency.name} />
        </CardField>
      </Card>
    );
  }
}

export default withStyles(styles)(AccountCountervalueCard);
