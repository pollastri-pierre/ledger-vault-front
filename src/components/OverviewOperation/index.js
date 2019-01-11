//@flow
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import CurrencyAccountValue from "../CurrencyAccountValue";
import CounterValue from "components/CounterValue";
import colors from "shared/colors";
import type { Account, TransactionType } from "data/types";
import OperationTypeIcon from "components/OperationTypeIcon";

const styles = {
  base: {
    textAlign: "center",
    marginBottom: "32px"
  },
  amount: {
    color: "black",
    letterSpacing: "-0.9px",
    fontSize: "20px",
    margin: 0
  },
  containerTitle: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center"
  },
  down: {
    fill: "#cccccc",
    width: "16px",
    height: "16px",
    marginBottom: 20
  },
  fiat: {
    fontSize: "11px",
    fontWeight: "600",
    color: colors.steel,
    display: "flex",
    marginTop: "7px",
    justifyContent: "center"
  },
  hash: {
    fontSize: "13px",
    margin: "auto",
    marginBottom: "30px",
    width: 290,
    overflowWrap: "break-word"
  }
};

type Props = {
  amount: number,
  account: Account,
  classes: Object,
  operationType: TransactionType
};
class OverviewOperation extends Component<Props, *> {
  render() {
    const { amount, account, classes, operationType } = this.props;
    const isReceive = operationType === "RECEIVE";

    return (
      <div className={classes.base}>
        <div>
          <div className={classes.containerTitle}>
            <OperationTypeIcon isReceive={isReceive} />
            <div
              className={classes.amount}
              style={{ color: isReceive ? colors.green : colors.shark }}
            >
              <CurrencyAccountValue
                account={account}
                value={amount}
                alwaysShowSign
                type={operationType}
              />
            </div>
          </div>
          <p className={classes.fiat}>
            <CounterValue
              value={amount}
              from={account.currency_id}
              alwaysShowSign
              type={operationType}
            />
          </p>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(OverviewOperation);
