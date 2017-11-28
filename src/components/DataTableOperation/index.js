//@flow
import React, { Component } from "react";
import { withRouter } from "react-router";
import { Link } from "react-router-relative-link";
import DateFormat from "../DateFormat";
import CurrencyAccountValue from "../CurrencyAccountValue";
import AccountName from "../AccountName";
import Comment from "../icons/Comment";
import DataTable from "../DataTable";
import NoDataPlaceholder from "../NoDataPlaceholder";
import type { Operation, Account, Note } from "../../data/types";
import "./index.css";

const stopPropagation = (e: SyntheticEvent<*>) => e.stopPropagation();

class OperationNoteLink extends Component<{ operation: Operation }> {
  render() {
    const { operation } = this.props;
    const note: ?Note = operation.notes.length > 0 ? operation.notes[0] : null;
    return (
      <span className="OperationNoteLink">
        <Link to={`./operation/${operation.uuid}/2`} onClick={stopPropagation}>
          <Comment fill="#e2e2e2" className="open-label" />
        </Link>
        {!note ? null : (
          <div className="tooltip-label">
            <p className="tooltip-label-title">{note.title}</p>
            <p className="tooltip-label-name">
              {note.author.first_name}&nbsp;{note.author.last_name}
            </p>
            <div className="hr" />
            <p className="tooltip-label-body">{note.body}</p>
          </div>
        )}
      </span>
    );
  }
}

class DateColumn extends Component<{ operation: Operation }> {
  render() {
    const { operation } = this.props;
    return (
      <span>
        <DateFormat format="ddd D MMM, h:mmA" date={operation.time} />
        <OperationNoteLink operation={operation} />
      </span>
    );
  }
}

class AccountColumn extends Component<{ account: ?Account }> {
  render() {
    const { account } = this.props;
    return account ? (
      <AccountName name={account.name} currency={account.currency} />
    ) : null;
  }
}

class AddressColumn extends Component<{ operation: Operation }> {
  render() {
    const { operation } = this.props;
    let hash = "";
    if (operation.type === "SEND") {
      hash = operation.senders[0];
    } else {
      hash = operation.recipients[0];
    }
    return (
      <span>
        <span className="type">
          {operation.type === "SEND" ? "TO" : "FROM"}
        </span>
        <span className="hash">{hash}</span>
      </span>
    );
  }
}

class StatusColumn extends Component<{ operation: Operation }> {
  render() {
    const { operation } = this.props;
    return (
      <span>{operation.confirmations > 0 ? "Confirmed" : "Not confirmed"}</span>
    );
  }
}

class AmountColumn extends Component<{
  operation: Operation,
  account: ?Account
}> {
  render() {
    const { operation, account } = this.props;
    return account ? (
      <CurrencyAccountValue
        account={account}
        value={operation.amount}
        alwaysShowSign
      />
    ) : null;
  }
}

class CountervalueColumn extends Component<{
  operation: Operation,
  account: ?Account
}> {
  render() {
    const { operation, account } = this.props;
    return account ? (
      <CurrencyAccountValue
        account={account}
        rate={operation.rate}
        value={operation.amount}
        alwaysShowSign
        countervalue
      />
    ) : null;
  }
}

const COLS = [
  {
    className: "date",
    title: "date",
    renderCell: DateColumn
  },
  {
    className: "account",
    title: "account",
    renderCell: AccountColumn
  },
  {
    className: "address",
    title: "address",
    renderCell: AddressColumn
  },
  {
    className: "status",
    title: "status",
    renderCell: StatusColumn
  },
  {
    className: "countervalue",
    title: "",
    renderCell: CountervalueColumn
  },
  {
    className: "amount",
    title: "amount",
    renderCell: AmountColumn
  }
];

class DataTableOperation extends Component<{
  operations: Array<Operation>,
  accounts: Array<Account>, // accounts is an array that should at least contains the operations's account_id
  columnIds: Array<string>,
  history: Object,
  match: Object
}> {
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
    const columns = COLS.filter(c => columnIds.includes(c.className));
    const data = operations.map(operation => ({
      operation,
      account: accounts.find(a => a.id === operation.account_id)
    }));
    return data.length === 0 ? (
      <NoDataPlaceholder title="No operations." />
    ) : (
      <DataTable data={data} columns={columns} renderRow={this.renderRow} />
    );
  }
}

export default withRouter(DataTableOperation);
