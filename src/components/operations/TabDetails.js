//@flow
import React, { Component, PureComponent } from "react";
import type { Operation, Account } from "data/types";
import { withStyles } from "@material-ui/core/styles";
import colors from "shared/colors";
import CurrencyAccountValue from "../CurrencyAccountValue";
import LineRow from "../LineRow";

const stylesList = {
  detailsContainer: {
    marginBottom: "24px",
    "& p": {
      fontSize: "12px",
      margin: "0px"
    }
  },
  detailsRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: "8px",
    color: colors.shark
  },
  currencyAccountValue: {
    textAlign: "right"
  },
  address: {
    flexBasis: "80%",
    overflow: "hidden",
    textOverflow: "ellipsis"
  }
};
class OperationListT<T: *> extends Component<{
  account: Account,
  title: string,
  entries: Array<T>,
  classes: Object
}> {
  render() {
    const { account, title, entries, classes } = this.props;
    return (
      <div className={classes.detailsContainer}>
        <LineRow label={title}>
          <strong>
            <CurrencyAccountValue
              account={account}
              value={entries.reduce((s, e) => s + e.value, 0)}
              alwaysShowSign
            />
          </strong>
        </LineRow>
        {entries.map(e => (
          <div className={classes.detailsRow} key={e.address}>
            <p className={classes.address} key={e.address}>
              {e.address}
            </p>
            {entries.length > 1 && (
              <p className={classes.currencyAccountValue}>
                <CurrencyAccountValue
                  account={account}
                  value={e.value}
                  alwaysShowSign
                />
              </p>
            )}
          </div>
        ))}
      </div>
    );
  }
}

const OperationList = withStyles(stylesList)(OperationListT);

const styles = {
  title: {
    fontWeight: "600",
    fontSize: "11px",
    textTransform: "uppercase",
    marginTop: "0"
  },
  hash: {
    fontSize: "12px",
    wordWrap: "break-word",
    color: colors.shark
  }
};

class TabDetails extends PureComponent<{
  operation: Operation,
  account: Account,
  classes: Object
}> {
  render() {
    const { operation, account, classes } = this.props;
    const { transaction } = operation;
    return (
      <div>
        <span className={classes.title}>Identifier</span>
        <p className={classes.hash}>{transaction.hash}</p>
        <OperationList
          title="From"
          account={account}
          entries={transaction.inputs}
        />
        <OperationList
          title="To"
          account={account}
          entries={transaction.outputs}
        />
      </div>
    );
  }
}

export default withStyles(styles)(TabDetails);
