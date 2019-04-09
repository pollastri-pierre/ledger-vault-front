// @flow
import React, { Component } from "react";
import { BigNumber } from "bignumber.js";
import { withStyles } from "@material-ui/core/styles";
import CounterValue from "components/CounterValue";
import colors from "shared/colors";
import type { Account, TransactionType } from "data/types";
import TransactionTypeIcon from "components/TransactionTypeIcon";
import CurrencyAccountValue from "../CurrencyAccountValue";

const styles = {
  base: {
    textAlign: "center",
    marginBottom: "32px",
  },
  amount: {
    color: "black",
    letterSpacing: "-0.9px",
    fontSize: "20px",
    margin: 0,
  },
  containerTitle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
  },
  down: {
    fill: "#cccccc",
    width: "16px",
    height: "16px",
    marginBottom: 20,
  },
  fiat: {
    fontSize: "11px",
    fontWeight: "600",
    color: colors.steel,
    display: "flex",
    marginTop: "7px",
    justifyContent: "center",
  },
  hash: {
    fontSize: "13px",
    margin: "auto",
    marginBottom: "30px",
    width: 290,
    overflowWrap: "break-word",
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
    const erc20Format = account.account_type === "ERC20";
    return (
      <div className={classes.base}>
        <div>
          <div className={classes.containerTitle}>
            <TransactionTypeIcon isReceive={isReceive} />
            <div
              className={classes.amount}
              style={{ color: isReceive ? colors.green : colors.shark }}
            >
              <CurrencyAccountValue
                account={account}
                value={amount}
                alwaysShowSign
                type={transactionType}
                erc20Format={erc20Format}
              />
            </div>
          </div>
          <div className={classes.fiat}>
            <CounterValue
              value={amount}
              fromAccount={account}
              alwaysShowSign
              type={transactionType}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(OverviewTransaction);
