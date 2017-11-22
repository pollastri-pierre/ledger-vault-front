//@flow
import React, { Component, PureComponent } from "react";
import type { Operation, Account } from "../../data/types";
import CurrencyAccountValue from "../CurrencyAccountValue";

class OperationList<T: *> extends Component<{
  account: Account,
  title: string,
  entries: Array<T>
}> {
  render() {
    const { account, title, entries } = this.props;
    // TODO this should not be a table. we don't want the price column to potentially take the whole space just because one cell do.
    // TODO the address cell probably should have proper text-overflow , nowrap
    return (
      <table className="operation-list details">
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
            <tr key={e.index}>
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

class TabDetails extends PureComponent<{
  operation: Operation,
  account: Account
}> {
  render() {
    const { operation, account } = this.props;
    const { transaction } = operation;
    return (
      <div className="operation-details-tab">
        <h4>Identifier</h4>
        <p>{transaction.hash}</p>
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

export default TabDetails;
