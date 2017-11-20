//@flow
import React, { Component } from "react";
import { withRouter } from "react-router";
import DateFormat from "../DateFormat";
import CurrencyAccountValue from "../CurrencyAccountValue";
import AccountName from "../AccountName";
import Comment from "../icons/Comment";
import DataTable from "../DataTable";
import Tooltip from "../utils/Tooltip";
import type { Operation, Account, Note } from "../../data/types";
import "./index.css";

const getHash = (operation: Operation): string => {
  let hash = "";
  if (operation.type === "SEND") {
    hash = operation.senders[0];
  } else {
    hash = operation.recipients[0];
  }
  return hash;
};

let DataTableOperationCount = 0;

class DataTableOperation extends Component<{
  operations: Array<Operation>,
  accounts: Array<Account>, // accounts is an array that should at least contains the operations's account_id
  columnIds: Array<string>,
  history: Object,
  match: Object
}> {
  id = ++DataTableOperationCount;

  openOperation = (uuid: string, n: number = 0) => {
    this.props.history.push(`${this.props.match.url}/operation/${uuid}/${n}`);
  };

  renderRow = (
    { operation }: { operation: Operation },
    index: number,
    children: string | React$Node
  ) => (
    <tr
      key={operation.uuid}
      style={{ cursor: "pointer" }}
      onClick={() => this.openOperation(operation.uuid, 0)}
    >
      {children}
    </tr>
  );

  render() {
    const { accounts, operations, columnIds } = this.props;
    type Cell = {
      operation: Operation,
      account: ?Account
    };
    const columns: Array<{ className: *, title: *, renderCell: Cell => * }> = [
      {
        className: "date",
        title: "date",
        renderCell: ({ operation }) => {
          const note: ?Note =
            operation.notes.length > 0 ? operation.notes[0] : null;
          const tooltipId =
            "DataTableOperationCount" + this.id + "_tooltip_" + operation.uuid;
          return (
            <span>
              <DateFormat format="ddd D MMM, h:mmA" date={operation.time} />
              <Comment
                fill="#e2e2e2"
                onClick={(e: Event) => {
                  e.stopPropagation();
                  this.openOperation(operation.uuid, 2);
                }}
                className="open-label"
                data-tip
                data-for={tooltipId}
              />
              {!note ? null : (
                <Tooltip id={tooltipId} className="tooltip-label">
                  <p className="tooltip-label-title">{note.title}</p>
                  <p className="tooltip-label-name">
                    {note.author.first_name} {note.author.last_name}
                  </p>
                  <div className="hr" />
                  <p className="tooltip-label-body">{note.body}</p>
                </Tooltip>
              )}
            </span>
          );
        }
      },
      {
        className: "account",
        title: "account",
        renderCell: ({ account }) =>
          account ? (
            <AccountName name={account.name} currency={account.currency} />
          ) : null
      },
      {
        className: "address",
        title: "address",
        renderCell: ({ operation }) => (
          <span>
            <span className="type">
              {operation.type === "SEND" ? "TO" : "FROM"}
            </span>
            <span className="hash">{getHash(operation)}</span>
          </span>
        )
      },
      {
        className: "status",
        title: "status",
        renderCell: ({ operation }) => (
          <span>
            {operation.confirmations > 0 ? "Confirmed" : "Not confirmed"}
          </span>
        )
      },
      {
        className: "countervalue",
        title: "",
        renderCell: ({ operation, account }) =>
          account ? (
            <CurrencyAccountValue
              account={account}
              rate={operation.rate}
              value={operation.amount}
              alwaysShowSign
              countervalue
            />
          ) : null
      },
      {
        className: "amount",
        title: "amount",
        renderCell: ({ operation, account }) =>
          account ? (
            <CurrencyAccountValue
              account={account}
              value={operation.amount}
              alwaysShowSign
            />
          ) : null
      }
    ].filter(c => columnIds.includes(c.className));
    const data: Array<Cell> = operations.map(operation => ({
      operation,
      account: accounts.find(a => a.id === operation.account_id)
    }));
    return (
      <DataTable data={data} columns={columns} renderRow={this.renderRow} />
    );
  }
}

export default withRouter(DataTableOperation);
