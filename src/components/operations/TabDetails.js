//@flow
import React, { Component, PureComponent, Fragment } from "react";
import cx from "classnames";
import type { Operation, Account } from "data/types";
import { withStyles } from "@material-ui/core/styles";
import colors from "shared/colors";
import CurrencyAccountValue from "../CurrencyAccountValue";
import LineRow from "../LineRow";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/helpers/currencies";
import type { TransactionETH } from "data/types";

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
  },
  small: {
    fontSize: 12
  }
};
const OperationETHDetails = withStyles(
  stylesList
)(
  ({
    transaction,
    classes
  }: {
    transaction: TransactionETH,
    classes: { [$Keys<typeof stylesList>]: string }
  }) => {
    return (
      <div className={classes.detailsContainer}>
        <LineRow label="FROM" />
        <div className={cx(classes.detailsRow, classes.small)}>
          {transaction.sender}
        </div>
        <LineRow label="To" />
        <div className={cx(classes.detailsRow, classes.small)}>
          {transaction.receiver}
        </div>
      </div>
    );
  }
);

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
    const cryptoCurrency = getCryptoCurrencyById(account.currency.name);
    return (
      <div>
        <span className={classes.title}>Identifier</span>
        <p className={classes.hash}>{transaction.hash}</p>
        {cryptoCurrency.family === "bitcoin" && (
          <Fragment>
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
          </Fragment>
        )}
        {cryptoCurrency.family === "ethereum" && (
          <OperationETHDetails transaction={transaction} />
        )}
      </div>
    );
  }
}

export default withStyles(styles)(TabDetails);
