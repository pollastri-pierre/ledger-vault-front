//@flow
import React, { Component } from "react";
import { withRouter } from "react-router";
import colors from "shared/colors";
import { Link } from "react-router-relative-link";
import DateFormat from "../DateFormat";
import CurrencyAccountValue from "../CurrencyAccountValue";
import AccountName from "../AccountName";
import Comment from "../icons/full/Comment";
import DataTable from "../DataTable";
import NoDataPlaceholder from "../NoDataPlaceholder";
import type { Operation, Account, Note } from "data/types";
import { withStyles } from "material-ui/styles";

type Cell = {
  operation: Operation,
  account: ?Account
};

const stopPropagation = (e: SyntheticEvent<*>) => e.stopPropagation();

const styles = {
  tr: {
    margin: "0",
    padding: "0",
    "&:before": {
      background: colors.ocean,
      content: "''",
      height: "26px",
      width: "0px",
      position: "absolute",
      left: "0",
      marginTop: "6px"
    },
    "&:hover:before": {
      width: "5px",
      transition: "width 200ms ease"
    }
  }
};

class OperationNoteLink extends Component<{
  operation: Operation,
  classes: Object
}> {
  render() {
    const { operation, classes } = this.props;
    const note: ?Note = operation.notes.length > 0 ? operation.notes[0] : null;
    return (
      <span className={classes.base}>
        <Link to={`./operation/${operation.id}/2`} onClick={stopPropagation}>
          <Comment color={colors.mouse} className={classes.comment} />
        </Link>
        {!note ? null : (
          <div className="tooltip-label">
            <p className="tooltip-label-title">{note.title}</p>
            <p className="tooltip-label-name">
              {note.author.first_name}&nbsp;{note.author.last_name}
            </p>
            <div className="hr" />
            <p className="tooltip-label-body">{note.content}</p>
          </div>
        )}
      </span>
    );
  }
}

const styles_note = {
  base: {
    position: "relative",
    marginLeft: "10px",
    verticalAlign: "sub",
    "& .tooltip-label": {
      pointerEvents: "none",
      opacity: "0",
      transition: "opacity 0.2s",
      zIndex: "100",
      position: "absolute",
      bottom: "30px",
      left: "-165px",
      fontSize: "11px",
      padding: "30px",
      background: "white",
      boxShadow:
        "0 0 5px 0 rgba(0, 0, 0, 0.04), 0 10px 10px 0 rgba(0, 0, 0, 0.04)",
      width: "350px",
      "&:after": {
        content: "''",
        position: "absolute",
        bottom: -15,
        left: "50%",
        borderLeft: "15px solid transparent",
        borderRight: "15px solid transparent",
        marginLeft: -15,
        borderTop: "white solid 15px"
      },
      "& .hr": {
        width: "100%",
        height: 1,
        backgroundColor: "#eeeeee",
        margin: 0,
        marginBottom: 17
      },

      "& .tooltip-label-title": {
        fontSize: 13,
        margin: 0,
        fontWeight: 600
      },

      "& .tooltip-label-name": {
        fontSize: 11,
        margin: 0,
        marginTop: 10,
        marginBottom: 19,
        color: "#999"
      },

      "& .tooltip-label-body": {
        fontSize: 11,
        lineHeight: 1.82,
        fontWeight: "normal",
        margin: 0,
        whiteSpace: "normal"
      }
    },
    "&:hover .tooltip-label": {
      opacity: 1
    }
  },
  comment: {
    width: 16,
    height: 12
  }
};
const OpNoteLink = withStyles(styles_note)(OperationNoteLink);

class DateColumn extends Component<Cell> {
  render() {
    const { operation } = this.props;
    return (
      <span>
        <DateFormat
          format="ddd D MMM, h:mmA"
          date={new Date(operation.time).toISOString()}
        />
        <OpNoteLink operation={operation} />
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
        type={operation.type}
        alwaysShowSign
      />
    ) : null;
  }
}

// class CountervalueColumn extends Component<Cell> {
//   render() {
//     const { operation, account } = this.props;
//     return account ? (
//       <CurrencyAccountValue
//         account={account}
//         rate={operation.rate}
//         value={operation.amount}
//         alwaysShowSign
//         countervalue
//       />
//     ) : null;
//   }
// }

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
  // {
  //   className: "countervalue",
  //   title: "",
  //   Cell: CountervalueColumn
  // },
  {
    className: "amount",
    title: "amount",
    Cell: AmountColumn
  }
];

class RowT extends Component<{
  cell: Cell,
  index: number,
  children: React$Node,
  classes: Object,
  openOperation: (number, number) => void
}> {
  shouldComponentUpdate({ cell }: *) {
    return this.props.cell.operation !== cell.operation;
  }
  render() {
    const {
      openOperation,
      cell: { operation },
      children,
      classes
    } = this.props;
    return (
      <tr
        style={{ cursor: "pointer" }}
        className={classes.tr}
        onClick={() => openOperation(operation.id, 0)}
      >
        {children}
      </tr>
    );
  }
}

const Row = withStyles(styles)(RowT);

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

  openOperation = (id: string, n: number = 0) => {
    this.props.history.push(`${this.props.match.url}/operation/${id}/${n}`);
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
