// @flow

import React, { PureComponent } from "react";

import MUITableCell from "@material-ui/core/TableCell";
import MUITableHead from "@material-ui/core/TableHead";
import MUITableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";

import Text from "components/base/Text";
import type { TableDefinition, TableItem } from "./types";

type TableHeaderProps = {
  tableDefinition: TableDefinition,
  type: string
};

export class TableHeader extends PureComponent<TableHeaderProps> {
  render() {
    const { tableDefinition, type } = this.props;

    return (
      <MUITableHead>
        <MUITableRow>
          {tableDefinition.map(item => (
            <HeaderCellComponent item={item} type={type} />
          ))}
        </MUITableRow>
      </MUITableHead>
    );
  }
}

type Props = {
  item: TableItem,
  type: string
};
type State = {
  order: string,
  orderBy: string
};

class HeaderCellComponent extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      order: "asc",
      orderBy: props.item.header.label
    };
  }

  createSortHandler = () => {
    const { item, type } = this.props; // eslint-disable-line no-unused-vars
    // NOTE: can be made as an accumulator of a few params to sort by
    const orderBy = item.header.label;
    let order = "desc";
    // TODO: make a call with a query like `/${type}?sort=${this.state.orderBy}&order=${this.state.order}`

    if (this.state.orderBy === orderBy && this.state.order === "desc") {
      order = "asc";
    }

    this.setState({ order, orderBy });
  };

  render() {
    const { item } = this.props;
    const { order, orderBy } = this.state;
    return (
      <MUITableCell
        align={item.header.align}
        key={item.header.label}
        sortDirection={orderBy === item.header.label ? order : false}
      >
        {item.header.sortable ? (
          <TableSortLabel
            active={item.header.sortable}
            direction={order}
            onClick={this.createSortHandler}
          >
            {item.header.label}
          </TableSortLabel>
        ) : (
          <Text>{item.header.label}</Text>
        )}
      </MUITableCell>
    );
  }
}
