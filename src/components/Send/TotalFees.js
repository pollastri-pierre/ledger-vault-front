//@flow
import React, { PureComponent } from "react";
import { withStyles } from "@material-ui/core/styles";
import { formatCurrencyUnit } from "@ledgerhq/live-common/lib/helpers/currencies";
import { Trans } from "react-i18next";
import CounterValue from "components/CounterValue";
import type { Account } from "data/types";
import colors from "shared/colors";

type Props = {
  account: Account,
  totalFees: number,
  classes: { [_: $Keys<typeof styles>]: string }
};

const styles = {
  totalFeesContainer: {
    padding: "0 40px",
    display: "flex",
    marginTop: 20,
    justifyContent: "flex-end",
    fontSize: 13
  },
  fiat: {
    marginLeft: 5,
    color: colors.steel
  }
};

class TotalFees extends PureComponent<Props> {
  render() {
    const { account, totalFees, classes } = this.props;
    return (
      <div className={classes.totalFeesContainer}>
        <span>
          <strong>
            <Trans i18nKey="send:details.totalFees" />{" "}
          </strong>
          {account.settings.currency_unit.code}{" "}
          {formatCurrencyUnit(account.settings.currency_unit, totalFees)}
        </span>
        <span className={classes.fiat}>
          (<CounterValue value={totalFees} from={account.currency_id} />)
        </span>
      </div>
    );
  }
}

export default withStyles(styles)(TotalFees);
