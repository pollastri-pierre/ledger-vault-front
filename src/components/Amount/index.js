// @flow
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";

import type { Account } from "data/types";
import colors from "shared/colors";

import CounterValue from "components/CounterValue";
import Box from "components/base/Box";
import Text from "components/base/Text";
import CurrencyAccountValue from "../CurrencyAccountValue";

const styles = {
  flat: {
    color: colors.steel,
    fontSize: 11
  },
  crypto: {
    fontSize: 13,
    color: colors.black
  },
  strong: {
    fontWeight: 600
  }
};

type Props = {
  account: Account,
  value: number,
  dataTest: ?string,
  strong?: boolean,
  erc20Format?: boolean,
  hideCountervalue?: boolean,
  classes: { [_: $Keys<typeof styles>]: string }
};

class Amount extends Component<Props> {
  render() {
    const {
      account,
      value,
      strong,
      dataTest,
      erc20Format,
      hideCountervalue
    } = this.props;

    const disableCountervalue = !!erc20Format;

    return (
      <Box horizontal align="center" flow={5}>
        <Text
          color={colors.black}
          data-test={dataTest}
          bold={strong}
          lineHeight={1}
        >
          <CurrencyAccountValue
            account={account}
            value={value}
            erc20Format={erc20Format}
          />
        </Text>
        {!hideCountervalue && (
          <Text small color={colors.steel} lineHeight={1}>
            {"("}
            <CounterValue
              value={value}
              from={account.currency_id}
              disableCountervalue={disableCountervalue}
            />
            {")"}
          </Text>
        )}
      </Box>
    );
  }
}

export default withStyles(styles)(Amount);
