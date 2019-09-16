// @flow
import React, { Component } from "react";
import { BigNumber } from "bignumber.js";
import { withStyles } from "@material-ui/core/styles";
import CounterValue from "components/CounterValue";
import colors from "shared/colors";
import type { Account, TransactionType } from "data/types";
import TransactionTypeIcon from "components/TransactionTypeIcon";
import Box from "components/base/Box";
import CurrencyAccountValue from "./CurrencyAccountValue";

const styles = {
  base: {
    textAlign: "center",
    marginBottom: "32px",
  },
  amount: {
    fontSize: "20px",
    margin: 0,
  },
  containerTitle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  fiat: {
    fontSize: "11px",
    fontWeight: "600",
    color: colors.steel,
    display: "flex",
    marginTop: "7px",
    justifyContent: "center",
  },
};

type Props = {
  amount: BigNumber,
  account: Account,
  classes: Object,
  transactionType: TransactionType,
};

class OverviewTransaction extends Component<Props, *> {
  render() {
    const { amount, account, classes, transactionType } = this.props;
    const isReceive = transactionType === "RECEIVE";
    return (
      <div className={classes.base}>
        <Box horizontal justify="center" align="center" flow={10}>
          <TransactionTypeIcon type={transactionType} />
          <div
            className={classes.amount}
            style={{ color: isReceive ? colors.green : colors.shark }}
          >
            <CurrencyAccountValue
              account={account}
              value={amount}
              alwaysShowSign
              type={transactionType}
            />
          </div>
        </Box>
        <div className={classes.fiat}>
          <CounterValue
            value={amount}
            fromAccount={account}
            alwaysShowSign
            type={transactionType}
          />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(OverviewTransaction);
