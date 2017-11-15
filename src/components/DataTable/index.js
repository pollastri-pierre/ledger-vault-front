//@flow
import React, { Component } from "react";
import "./index.css";

type Column<Cell> = {
  title: string,
  className: string,
  renderCell: (cell: Cell) => any
};

export default class DataTable<Cell> extends Component<*> {
  props: {
    columns: Array<Column<Cell>>,
    data: Array<Cell>,
    renderRow: (
      cell: Cell,
      index: number,
      children: string | React$Node
    ) => React$Node
  };
  static defaultProps = {
    renderRow: (cell: Cell, index: number, children: string | React$Node) => (
      <tr key={index}>{children}</tr>
    )
  };
  render() {
    const { columns, data, renderRow } = this.props;
    return (
      <table className="data-table">
        <thead>
          <tr>
            {columns.map((column, i) => (
              <th key={i} className={column.className}>
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((cell, y) =>
            renderRow(
              cell,
              y,
              columns.map((column, x) => {
                const C = column.renderCell;
                return (
                  <td key={x} className={column.className}>
                    <C {...cell} />
                  </td>
                );
              })
            )
          )}
        </tbody>
      </table>
    );
  }
}
