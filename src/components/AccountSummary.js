// @flow

import React, { PureComponent } from "react";
import cx from "classnames";
import { withStyles } from "@material-ui/core/styles";

import type { Account } from "data/types";
import { getCryptoCurrencyById } from "utils/cryptoCurrencies";
import CryptoCurrencyIcon from "components/CryptoCurrencyIcon";
import colors from "shared/colors";

const styles = {
  container: {
    display: "flex",
    alignItems: "center"
  },
  iconContainer: {
    width: 40,
    height: 40,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    fontWeight: "bold",
    fontSize: 14
  },
  desc: {
    fontSize: 10,
    color: colors.steel
  }
};

type Props = {
  account: Account,

  classes: { [_: $Keys<typeof styles>]: string },
  className?: string
};

class AccountSummary extends PureComponent<Props> {
  render() {
    const { account, className, classes } = this.props;
    const currency = getCryptoCurrencyById(account.currency_id);
    return (
      <div className={cx(className, classes.container)}>
        <div className={classes.iconContainer}>
          <CryptoCurrencyIcon
            currency={currency}
            color={currency.color}
            size={24}
          />
        </div>
        <div>
          <div className={classes.title}>{account.name}</div>
          <div className={classes.desc}>{`${currency.name} #${
            account.id
          }`}</div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(AccountSummary);
