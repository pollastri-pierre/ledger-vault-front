//@flow
import React, { Component, PureComponent } from "react";
import type { Operation, Account } from "data/types";
import { withStyles } from "@material-ui/core/styles";
import colors from "shared/colors";
import CurrencyAccountValue from "../CurrencyAccountValue";

const stylesList = {
  base: {
    borderCollapse: "collapse",
    width: "100%",
    fontSize: 11,
    "& tr": {
      height: "47px",
      borderTop: `1px solid ${colors.argile}`
    },
    "& tr:first-child": {
      border: "0"
    },
    "& thead > tr td:first-child": {
      fontWeight: 600
    },
    "& tbody > tr td:first-child": {
      fontWeight: "normal",
      fontSize: "11px"
      // textTransform: "uppercase"
    },
    "& tr td:last-child": {
      fontSize: "13px",
      textAlign: "right"
    },
    "& strong": {
      fontWeight: "600",
      fontSize: "13px"
    }
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
    // TODO this should not be a table. we don't want the price column to potentially take the whole space just because one cell do.
    // TODO the address cell probably should have proper text-overflow , nowrap
    return (
      <table className={classes.base}>
        <thead>
          <tr>
            <td>{title}</td>
            <td>
              <strong>
                <CurrencyAccountValue
                  account={account}
                  value={entries.reduce((s, e) => s + e.value, 0)}
                  alwaysShowSign
                />
              </strong>
            </td>
          </tr>
        </thead>
        <tbody>
          {entries.map(e => (
            <tr key={e.address}>
              <td>{e.address}</td>
              <td>
                <CurrencyAccountValue
                  account={account}
                  value={e.value}
                  alwaysShowSign
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

const OperationList = withStyles(stylesList)(OperationListT);

const styles = {
  title: {
    textTransform: "uppercase",
    fontSize: "11px",
    lineHeight: "23px",
    color: "#000",
    marginTop: "0"
  },
  hash: {
    fontSize: "13px",
    wordWrap: "break-word"
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
        <h4 className={classes.title}>Identifier</h4>
        <p className={classes.hash}>{transaction.hash}</p>
        <OperationList
          title="INPUTS"
          account={account}
          entries={transaction.inputs}
        />
        <OperationList
          title="OUTPUTS"
          account={account}
          entries={transaction.outputs}
        />
      </div>
    );
  }
}

export default withStyles(styles)(TabDetails);
