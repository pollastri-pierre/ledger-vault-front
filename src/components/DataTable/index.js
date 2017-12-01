//@flow
import React, { Component, PureComponent } from "react";
import "./index.css";

type Column<Cell> = {
  title: string,
  className: string,
  Cell: React$ComponentType<$Shape<Cell>>
};

class DefaultRow<Cell> extends Component<{
  cell: Cell,
  index: number,
  children: React$Node
}> {
  shouldComponentUpdate({ cell }: *) {
    return this.props.cell !== cell;
  }
  render() {
    const { index, children } = this.props;
    return <tr key={index}>{children}</tr>;
  }
}

export default class DataTable<Cell> extends PureComponent<{
  columns: Array<Column<Cell>>,
  data: Array<Cell>,
  Row: React$ComponentType<{
    cell: Cell,
    index: number,
    children: React$Node
  }>
}> {
  static defaultProps = {
    Row: DefaultRow
  };
  render() {
    const { columns, data, Row } = this.props;
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
          {data.map((cell, y) => (
            <Row cell={cell} key={y} index={y}>
              {columns.map((column, x) => (
                <td key={x} className={column.className}>
                  <column.Cell {...cell} />
                </td>
              ))}
            </Row>
          ))}
        </tbody>
      </table>
    );
  }
}
