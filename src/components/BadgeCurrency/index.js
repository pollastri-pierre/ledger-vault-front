// @flow
import React, { PureComponent } from "react";
import classnames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import { getCryptoCurrencyIcon } from "utils/cryptoCurrencies";
import type { CryptoCurrency } from "@ledgerhq/live-common/lib/types";

const styles = {
  base: {
    verticalAlign: "middle",
    marginRight: "6px",
    display: "inline-block",
    "& svg": {
      verticalAlign: "text-bottom"
    }
  }
};
class BadgeCurrency extends PureComponent<{
  size: number,
  classes: { [_: $Keys<typeof styles>]: string },
  currency: CryptoCurrency,
  className?: string
}> {
  static defaultProps = {
    size: 20
  };

  render() {
    const { size, currency, classes, className } = this.props;
    const IconCurrency = getCryptoCurrencyIcon(currency);

    return IconCurrency ? (
      <span className={classnames(classes.base, className)}>
        <IconCurrency size={size} color={currency.color} />
      </span>
    ) : null;
  }
}

export default withStyles(styles)(BadgeCurrency);
