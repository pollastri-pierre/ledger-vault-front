// @flow
import React, { Component, PureComponent, Fragment } from "react";
import cx from "classnames";
import type { Operation, Account, TransactionETH } from "data/types";
import { withStyles } from "@material-ui/core/styles";
import colors from "shared/colors";
import { getCryptoCurrencyById } from "@ledgerhq/live-common/lib/currencies";
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
  },
  small: {
    fontSize: 12
  }
};
const OperationETHDetails = withStyles(stylesList)(
  ({
    transaction,
    classes
  }: {
    transaction: TransactionETH,
    classes: { [$Keys<typeof stylesList>]: string }
  }) => (
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
  )
);

class OperationListT<T: *> extends Component<{
  account: Account,
  title: string,
  entries: Array<T>,
  classes: Object,
  dataTest: string
}> {
  render() {
    const { account, title, entries, classes, dataTest } = this.props;
    return (
      <div className={classes.detailsContainer}>
        <LineRow label={title}>
          <strong data-test={`${dataTest}-currency-unit`}>
            <CurrencyAccountValue
              account={account}
              value={entries.reduce((s, e) => s + e.value, 0)}
              alwaysShowSign
            />
          </strong>
        </LineRow>
        {entries.map(e => (
          <div className={classes.detailsRow} key={e.address}>
            <p className={classes.address} key={e.address} data-test={dataTest}>
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
    const cryptoCurrency = getCryptoCurrencyById(account.currency_id);
    return (
      <div>
        <span
          data-test="operation-details-identifier"
          className={classes.title}
        >
          Identifier
        </span>
        <p className={classes.hash}>{transaction.hash}</p>
        {cryptoCurrency.family === "bitcoin" && (
          <Fragment>
            <OperationList
              title="From"
              dataTest="operation-details-from"
              account={account}
              entries={transaction.inputs}
            />
            <OperationList
              title="To"
              dataTest="operation-details-to"
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
