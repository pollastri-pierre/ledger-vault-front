//@flow
import React, { Component } from 'react';
import './index.css';

type Column<Cell> = {
  title: string,
  className: string,
  renderCell: (cell: Cell) => *
};

export default class DataTable<Cell> extends Component<*> {
  props: {
    columns: Array<Column<Cell>>,
    data: Array<Cell>
  };
  render() {
    const { columns, data } = this.props;
    return (
      <table className="data-table">
        <thead>
          <tr>
            {columns.map(column => (
              <th className={column.className}>{column.title}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((cell, y) => (
            <tr key={y}>
              {columns.map((column, x) => {
                const C = column.renderCell;
                return (
                  <td key={x} className={column.className}>
                    <C {...cell} />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}
