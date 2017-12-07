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

type Cell = {
  operation: Operation,
  account: ?Account
};

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

class DateColumn extends Component<Cell> {
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

class AccountColumn extends Component<Cell> {
  render() {
    const { account } = this.props;
    return account ? (
      <AccountName name={account.name} currency={account.currency} />
    ) : null;
  }
}

class AddressColumn extends Component<Cell> {
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

class StatusColumn extends Component<Cell> {
  render() {
    const { operation } = this.props;
    return (
      <span>{operation.confirmations > 0 ? "Confirmed" : "Not confirmed"}</span>
    );
  }
}

class AmountColumn extends Component<Cell> {
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

class CountervalueColumn extends Component<Cell> {
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
    Cell: DateColumn
  },
  {
    className: "account",
    title: "account",
    Cell: AccountColumn
  },
  {
    className: "address",
    title: "address",
    Cell: AddressColumn
  },
  {
    className: "status",
    title: "status",
    Cell: StatusColumn
  },
  {
    className: "countervalue",
    title: "",
    Cell: CountervalueColumn
  },
  {
    className: "amount",
    title: "amount",
    Cell: AmountColumn
  }
];

class Row extends Component<{
  cell: Cell,
  index: number,
  children: React$Node,
  openOperation: (string, number) => void
}> {
  shouldComponentUpdate({ cell }: *) {
    return this.props.cell.operation !== cell.operation;
  }
  render() {
    const { openOperation, cell: { operation }, children } = this.props;
    return (
      <tr
        style={{ cursor: "pointer" }}
        onClick={() => openOperation(operation.uuid, 0)}
      >
        {children}
      </tr>
    );
  }
}

class DataTableOperation extends Component<
  {
    operations: Array<Operation>,
    accounts: Array<Account>, // accounts is an array that should at least contains the operations's account_id
    columnIds: Array<string>,
    history: Object,
    match: Object
  },
  *
> {
  state = {
    columns: COLS.filter(c => this.props.columnIds.includes(c.className))
  };

  openOperation = (uuid: string, n: number = 0) => {
    this.props.history.push(`${this.props.match.url}/operation/${uuid}/${n}`);
  };

  renderRow = (props: *) => (
    <Row {...props} openOperation={this.openOperation} />
  );

  componentWillReceiveProps(props) {
    if (props.columnIds !== this.props.columnIds) {
      this.setState({
        columns: COLS.filter(c => props.columnIds.includes(c.className))
      });
    }
  }

  render() {
    const { columns } = this.state;
    const { accounts, operations } = this.props;
    const data = operations.map(operation => ({
      operation,
      account: accounts.find(a => a.id === operation.account_id)
    }));
    return data.length === 0 ? (
      <NoDataPlaceholder title="No operations." />
    ) : (
      <DataTable data={data} columns={columns} Row={this.renderRow} />
    );
  }
}

export default withRouter(DataTableOperation);
