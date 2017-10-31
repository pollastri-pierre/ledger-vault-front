//@flow
import React, { Component } from "react";
import { connect } from "react-redux";
import DateFormat from "../DateFormat";
import CurrencyNameValue from "../CurrencyNameValue";
import AccountName from "../AccountName";
import { openOperationModal } from "../../redux/modules/operations";
import Comment from "../icons/Comment";
import DataTable from "../DataTable";
import Tooltip from "../utils/Tooltip";
import type { Operation } from "../../datatypes";
import "./index.css";

const mapStateToProps = () => ({});

const mapDispatchToProps = dispatch => ({
  onGetOperation: (id, n) => dispatch(openOperationModal(id, n))
});

const getHash = (operation: Operation): string => {
  let hash = "";
  if (operation.type === "SEND") {
    hash = operation.senders[0];
  } else {
    hash = operation.recipients[0];
  }
  return hash;
};

// TODO migrate all the operations/List in this component.

let DataTableOperationCount = 0;

class DataTableOperation extends Component<*> {
  props: {
    operations: Array<Operation>,
    columnIds: Array<string>,
    onGetOperation: (uuid: string, n: ?number) => void
  };

  id = ++DataTableOperationCount;

  openOperation = (uuid: string, n: ?number) => {
    this.props.onGetOperation(uuid, n);
  };

  renderRow = (operation: Operation, index: number, children: *) => (
    <tr
      key={operation.uuid}
      style={{ cursor: "pointer" }}
      onClick={() => {
        this.openOperation(operation.uuid);
      }}
    >
      {children}
    </tr>
  );

  render() {
    const { operations, columnIds } = this.props;
    const columns = [
      {
        className: "date",
        title: "date",
        renderCell: operation => {
          const note = operation.notes.length > 0 ? operation.notes[0] : null;
          const tooltipId =
            "DataTableOperationCount" + this.id + "_tooltip_" + operation.uuid;
          return (
            <span>
              <DateFormat format="ddd D MMM, h:mmA" date={operation.time} />
              <Comment
                fill="#e2e2e2"
                onClick={e => {
                  e.stopPropagation();
                  this.openOperation(operation.uuid, 2);
                }}
                className="open-label"
                data-tip
                data-for={tooltipId}
              />
              {note && (
                <Tooltip id={tooltipId} className="tooltip-label">
                  <p className="tooltip-label-title">{note.title}</p>
                  <p className="tooltip-label-name">
                    {note.author.firstname} {note.author.name}
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
        renderCell: ({ account, currency }) =>
          account &&
          currency && <AccountName name={account.name} currency={currency} />
      },
      {
        className: "address",
        title: "address",
        renderCell: operation => (
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
        renderCell: operation => (
          <span>
            {operation.confirmations > 0 ? "Confirmed" : "Not confirmed"}
          </span>
        )
      },
      {
        className: "countervalue",
        title: "",
        renderCell: operation => (
          <CurrencyNameValue
            currencyName={operation.reference_conversion.currency_name}
            value={operation.reference_conversion.amount}
            alwaysShowSign
          />
        )
      },
      {
        className: "amount",
        title: "amount",
        renderCell: operation => (
          <CurrencyNameValue
            currencyName={operation.currency_name}
            value={operation.amount}
            alwaysShowSign
          />
        )
      }
    ].filter(c => columnIds.includes(c.className));
    return (
      <DataTable
        data={operations}
        columns={columns}
        renderRow={this.renderRow}
      />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DataTableOperation);
