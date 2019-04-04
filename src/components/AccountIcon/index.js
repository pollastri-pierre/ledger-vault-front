// @flow
import React, { PureComponent } from "react";
import colors from "shared/colors";
import classnames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import ERC20TokenIcon from "components/icons/ERC20Token";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";

import { getCryptoCurrencyIcon } from "utils/cryptoCurrencies";

const styles = {
  base: {
    verticalAlign: "middle",
    marginRight: 6,
    display: "inline-block",
    "& svg": {
      verticalAlign: "text-bottom"
    }
  },
  placeholder: {
    display: "inline-block",
    background: colors.argile,
    borderRadius: "50%"
  }
};
type Props = {
  size: number,
  classes: { [_: $Keys<typeof styles>]: string },
  className?: string,
  currencyId?: string,
  isERC20?: boolean
};
class AccountIcon extends PureComponent<Props> {
  static defaultProps = {
    size: 20
  };

  renderPlaceholder = () => {
    const { classes } = this.props;
    return <div className={classes.placeholder} />;
  };

  render() {
    const { size, isERC20, classes, currencyId, className } = this.props;
    let inner;
    // if isERC20, straightfoward we display the erc20icon
    if (isERC20) {
      inner = <ERC20TokenIcon size={size} />;
    } else {
      const currency = currencyId && getCryptoCurrencyById(currencyId);
      const IconCurrency = currency ? getCryptoCurrencyIcon(currency) : null;
      inner =
        currency && IconCurrency ? (
          <IconCurrency size={size} color={currency.color} />
        ) : (
          this.renderPlaceholder()
        );
    }
    return <span className={classnames(classes.base, className)}>{inner}</span>;
  }
}

export default withStyles(styles)(AccountIcon);
