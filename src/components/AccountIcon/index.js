// @flow

import React, { PureComponent } from "react";

import colors from "shared/colors";
import ERC20TokenIcon from "components/icons/ERC20Token";
import Box from "components/base/Box";

import {
  getCryptoCurrencyIcon,
  getCryptoCurrencyById
} from "utils/cryptoCurrencies";

const placeholderStyle = {
  background: colors.argile,
  borderRadius: "50%"
};

type Props = {
  size: number,
  currencyId?: string,
  isERC20?: boolean
};

class AccountIcon extends PureComponent<Props> {
  static defaultProps = {
    size: 16
  };

  Placeholder = () => {
    const { size } = this.props;
    return <div style={{ ...placeholderStyle, width: size, height: size }} />;
  };

  Inner = () => {
    const { Placeholder } = this;
    const { size, isERC20, currencyId } = this.props;
    if (isERC20) return <ERC20TokenIcon size={size} />;
    const currency = currencyId && getCryptoCurrencyById(currencyId);
    if (!currency) return <Placeholder />;
    const IconCurrency = currency ? getCryptoCurrencyIcon(currency) : null;
    if (!IconCurrency) return <Placeholder />;
    return <IconCurrency size={size} color={currency.color} />;
  };

  render() {
    const { Inner } = this;
    const { size } = this.props;

    // TODO: put width/height in a state.style object to avoid create new ref
    return (
      <Box align="center" style={{ width: size, height: size }}>
        <Inner />
      </Box>
    );
  }
}

export default AccountIcon;
