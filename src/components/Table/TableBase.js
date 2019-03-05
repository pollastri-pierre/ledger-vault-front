// @flow

import React, { PureComponent } from "react";
import type { ObjectParameters } from "query-string";

import MUITableCell from "@material-ui/core/TableCell";
import MUITableHead from "@material-ui/core/TableHead";
import MUITableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";

import Text from "components/base/Text";
import type { TableDefinition, TableItem } from "./types";

type TableHeaderProps = {
  tableDefinition: TableDefinition,
  onSortChange?: (string, ?string) => void,
  queryParams?: ObjectParameters,
  type: string
};

export class TableHeader extends PureComponent<TableHeaderProps> {
  render() {
    const { tableDefinition, type, onSortChange, queryParams } = this.props;

    return (
      <MUITableHead>
        <MUITableRow>
          {tableDefinition.map(item => (
            <HeaderCellComponent
              key={item.body.prop}
              item={item}
              type={type}
              onSortChange={onSortChange}
              queryParams={queryParams}
            />
          ))}
        </MUITableRow>
      </MUITableHead>
    );
  }
}

type Props = {
  item: TableItem,
  type: string,
  onSortChange?: (string, ?string) => void,
  queryParams?: ObjectParameters
};

class HeaderCellComponent extends PureComponent<Props> {
  handleChangeSort = () => {
    const { item, type, onSortChange, queryParams } = this.props; // eslint-disable-line no-unused-vars
    if (!onSortChange) return;
    const { orderBy, order } = resolveSort(queryParams);
    const newOrderBy = item.body.prop;

    // cycle through orders: if first time we click, we set order ASC,
    // then DESC, then we remove the order
    const newOrder =
      orderBy === newOrderBy
        ? order
          ? order === "asc"
            ? "desc"
            : null
          : "asc"
        : "asc";

    onSortChange(newOrderBy, newOrder);
  };

  render() {
    const { item, queryParams } = this.props;
    const { orderBy, order } = resolveSort(queryParams);

    return (
      <MUITableCell
        align={item.header.align}
        key={item.body.prop}
        sortDirection={orderBy === item.body.prop ? order : false}
      >
        {item.header.sortable ? (
          <TableSortLabel
            active={!!(order && orderBy && orderBy === item.body.prop)}
            direction={order || "asc"}
            onClick={this.handleChangeSort}
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

function resolveSort(queryParams: ?ObjectParameters) {
  return {
    orderBy: (queryParams && queryParams.orderBy) || null,
    order: (queryParams && queryParams.order) || null
  };
}
