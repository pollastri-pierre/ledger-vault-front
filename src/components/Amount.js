// @flow
import React, { Component } from "react";
import { BigNumber } from "bignumber.js";
import { withStyles } from "@material-ui/core/styles";

import type { Account } from "data/types";
import colors from "shared/colors";

import CounterValue from "components/CounterValue";
import Box from "components/base/Box";
import Text from "components/base/Text";
import CurrencyAccountValue from "./CurrencyAccountValue";

const styles = {
  flat: {
    color: colors.steel,
    fontSize: 11,
  },
  crypto: {
    fontSize: 13,
    color: colors.black,
  },
  strong: {
    fontWeight: 600,
  },
};

type Props = {
  account: Account,
  value: BigNumber,
  dataTest: ?string,
  strong?: boolean,
  disableERC20?: boolean,
  hideCountervalue?: boolean,
  smallerInnerMargin?: boolean,
  classes: { [_: $Keys<typeof styles>]: string },
};

class Amount extends Component<Props> {
  render() {
    const {
      account,
      value,
      strong,
      dataTest,
      disableERC20,
      hideCountervalue,
      smallerInnerMargin,
    } = this.props;

    const cvProps = {};
    if (disableERC20) {
      Object.assign(cvProps, { from: account.currency });
    } else {
      Object.assign(cvProps, { fromAccount: account });
    }
    Object.assign(cvProps, { smallerInnerMargin });
    return (
      <Box horizontal align="center" justify="center" flow={5}>
        <Text
          color={colors.black}
          data-test={dataTest}
          fontWeight={strong ? "bold" : null}
          lineHeight={1}
        >
          <CurrencyAccountValue
            account={account}
            value={value}
            disableERC20={disableERC20}
          />
        </Text>
        {!hideCountervalue && (
          <Text size="small" color={colors.steel} lineHeight={1}>
            {"("}
            <CounterValue value={value} {...cvProps} />
            {")"}
          </Text>
        )}
      </Box>
    );
  }
}

export default withStyles(styles)(Amount);
