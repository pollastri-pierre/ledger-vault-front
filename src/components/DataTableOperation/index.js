//@flow
import cx from "classnames";
import React, { Component } from "react";
import CounterValue from "components/CounterValue";
import { withRouter } from "react-router";
import colors from "shared/colors";
import { Link } from "react-router-relative-link";
import DateFormat from "../DateFormat";
import CurrencyAccountValue from "../CurrencyAccountValue";
import OperationStatus from "components/OperationStatus";
import AccountName from "../AccountName";
import Comment from "../icons/full/Comment";
import DataTable from "../DataTable";
import NoDataPlaceholder from "../NoDataPlaceholder";
import type { Operation, Account, Note } from "data/types";
import { withStyles } from "@material-ui/core/styles";
import Circle from "components/Circle";
import Receive from "components/icons/Receive";
import Send from "components/icons/Send";

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
  },
  unknown: {
    opacity: 0.4,
    cursor: "default !important"
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
        {note &&
          note.title !== "" &&
          note.content !== "" && (
            <div className="tooltip-label">
              <p className="tooltip-label-title">{note.title}</p>
              <p className="tooltip-label-name">{note.author.username}</p>
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
const OpNoteLink = withStyles(styles_note)(OperationNoteLink); // eslint-disable-line

class DateColumn extends Component<Cell> {
  render() {
    const { operation } = this.props;
    return (
      <span>
        <DateFormat format="ddd D MMM, h:mmA" date={operation.created_on} />
        {/* <OpNoteLink operation={operation} /> */}
      </span>
    );
  }
}

class NoteColumn extends Component<Cell> {
  render() {
    const { operation } = this.props;
    const note = operation.notes && operation.notes[0];

    if (note && note.title && note.title !== "") {
      return <span>{note.title}</span>;
    }
    return <span />;
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
    const isReceive = operation.type === "RECEIVE";
    let hash = "";
    if (operation.error) {
      return <span className="hash">{operation.recipient}</span>;
    }
    if (operation.type === "SEND") {
      hash = operation.recipients[0];
    } else {
      hash = operation.senders[0];
    }
    return (
      <div style={{ display: "flex", flexDirection: "row" }}>
        <Circle
          bg={isReceive ? colors.translucentGreen : colors.translucentGrey}
          size="18px"
        >
          <div style={{ justifyContent: "center" }}>
            {isReceive ? (
              <Receive size={9} color={colors.green} />
            ) : (
              <Send size={9} color={colors.shark} />
            )}
          </div>
        </Circle>

        <span className="hash">{hash}</span>
      </div>
    );
  }
}

class StatusColumn extends Component<Cell> {
  render() {
    const { operation } = this.props;
    if (operation.error) {
      return <span>unknown</span>;
    }
    return <OperationStatus operation={operation} />;
  }
}

class AmountColumn extends Component<Cell> {
  render() {
    const { operation, account } = this.props;
    return account ? (
      <CurrencyAccountValue
        account={account}
        value={operation.amount || (operation.price && operation.price.amount)}
        type={operation.type}
        alwaysShowSign
      />
    ) : null;
  }
}

class CountervalueColumn extends Component<Cell> {
  render() {
    const { operation, account } = this.props;
    if (account) {
      return (
        <CounterValue
          from={account.currency.name}
          value={operation.amount || operation.price.amount}
          alwaysShowSign
          type={operation.type}
        />
      );
    }
    return null;
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
    className: "note",
    title: "label",
    Cell: NoteColumn
  },
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
    return (
      this.props.cell.operation !== cell.operation ||
      cell.account !== this.props.cell.operation
    );
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
        className={cx(classes.tr, { [classes.unknown]: operation.error })}
        onClick={() => {
          if (!operation.error) {
            openOperation(operation.id, 0);
          }
        }}
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

  componentDidUpdate(props) {
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
