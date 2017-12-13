//@flow
import React, { Component, PureComponent } from "react";
import colors from "../../shared/colors";
import injectSheet from "react-jss";

const styles = {
  base: {
    width: "100%",
    borderCollapse: "collapse",
    "& th": {
      textAlign: "left",
      textTransform: "uppercase",
      fontWeight: "600",
      fontSize: "10px",
      color: colors.steel,
      "&.amount": {
        textAlign: "right"
      }
    },
    "& tbody td": {
      borderBottom: `1px solid ${colors.argile}`,
      height: "40px"
    },
    "& tbody tr:last-child td": {
      borderBottom: "0"
    }
  },
  right: {
    textAlign: "right"
  },
  address: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: "250px"
  },
  countervalue: {
    textAlign: "right",
    fontSize: "13px",
    color: colors.steel
  },
  amount: {
    textAlign: "right",
    fontSize: "13px",
    "& .sign-positive": {
      fontWeight: "600"
    }
  },
  date: {
    fontSize: "10px",
    fontWeight: "600",
    textTransform: "uppercase",
    whiteSpace: "nowrap"
  },
  account: {
    fontSize: "13px"
  },
  status: {
    fontiSize: "11px",
    color: colors.steel
  }
};
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

class DataTable<Cell> extends PureComponent<{
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
    const { columns, data, Row, classes } = this.props;
    return (
      <table className={classes.base}>
        <thead>
          <tr>
            {columns.map((column, i) => (
              <th key={i} className={classes[column.className]}>
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((cell, y) => (
            <Row cell={cell} key={y} index={y}>
              {columns.map((column, x) => (
                <td key={x} className={classes[column.className]}>
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
export default injectSheet(styles)(DataTable);
