//@flow
import React, { Component, PureComponent } from "react";
import colors from "shared/colors";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  base: {
    width: "100%",
    borderCollapse: "collapse",
    "& thead tr:before": {
      content: "''",
      height: "26px",
      width: "0px",
      opacity: "0",
      left: "0",
      marginTop: "6px"
    },
    "& th": {
      textAlign: "left",
      textTransform: "uppercase",
      fontWeight: "600",
      fontSize: "10px",
      color: colors.steel
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
    maxWidth: "250px",
    "& .type": {
      fontSize: "10px",
      color: "#767676",
      fontWeight: "600",
      width: "36px",
      paddingRight: "5px"
    },
    "& .hash": {
      fontSize: "11px"
    }
  },
  countervalue: {
    textAlign: "right",
    fontSize: "13px",
    color: colors.steel
  },
  amount: {
    textAlign: "right !important",
    fontSize: "13px",
    "& .sign-positive": {
      fontWeight: "600"
    }
  },
  date: {
    fontSize: "10px",
    width: 140,
    fontWeight: "600",
    textTransform: "uppercase",
    whiteSpace: "nowrap"
  },
  account: {
    fontSize: "13px"
  },
  note: {
    textAlign: "left",
    fontSize: 11,
    color: colors.steel
  },
  status: {
    fontSize: "11px",
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
  classes: Object,
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
    console.log(columns);
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
export default withStyles(styles)(DataTable);
