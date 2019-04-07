// @flow

import React, { PureComponent } from "react";
import styled from "styled-components";
import MUITable from "@material-ui/core/Table";
import type { ObjectParameters, ObjectParameter } from "query-string";

import MUITableCell from "@material-ui/core/TableCell";
import MUITableHead from "@material-ui/core/TableHead";
import MUITableRow from "@material-ui/core/TableRow";

import Text from "components/base/Text";
import colors, { opacity } from "shared/colors";
import TableSort from "./TableSort";

import type { TableDefinition, TableItem } from "./types";
import type { Direction } from "./TableSort";

type TableHeaderProps = {
  tableDefinition: TableDefinition,
  onSortChange?: (string, ?string) => void,
  queryParams?: ObjectParameters,
};

export class TableHeader extends PureComponent<TableHeaderProps> {
  render() {
    const { tableDefinition, onSortChange, queryParams } = this.props;

    return (
      <MUITableHead>
        <MUITableRow>
          {tableDefinition.map(item => (
            <HeaderCellComponent
              key={item.body.prop}
              item={item}
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
  onSortChange?: (string, ?string) => void,
  queryParams?: ObjectParameters,
};

class HeaderCellComponent extends PureComponent<Props> {
  handleChangeSort = () => {
    const { item, onSortChange, queryParams } = this.props;
    if (!onSortChange) return;
    const { orderBy, order } = resolveSort(queryParams);
    const newOrderBy = item.body.prop;

    // cycle through orders: if first time we click, we set order ASC,
    // then DESC, then we remove the order
    const cycles = {
      desc: ["desc", "asc"],
      asc: ["asc", "desc"],
    };
    const cycle = item.header.sortFirst === "desc" ? cycles.desc : cycles.asc;
    const newOrder =
      orderBy === newOrderBy
        ? order
          ? order === cycle[0]
            ? cycle[1]
            : null
          : cycle[0]
        : cycle[0];

    onSortChange(newOrderBy, newOrder);
  };

  render() {
    const { item, queryParams } = this.props;
    const { orderBy, order } = resolveSort(queryParams);
    const direction = resolveDirection(
      orderBy === item.body.prop ? order : null,
    );
    return (
      <HeaderCell align={item.header.align} key={item.body.prop}>
        {item.header.sortable ? (
          <TableSort
            align={item.header.align}
            direction={direction}
            label={item.header.label}
            onClick={this.handleChangeSort}
          />
        ) : (
          <Text>{item.header.label}</Text>
        )}
      </HeaderCell>
    );
  }
}

const HeaderCell = styled(MUITableCell)`
  && {
    background-color: #fafafa;
    border-bottom-color: #f0f0f0;
  }
`;

export const Table = styled(MUITable)`
  && {
    user-select: none;
    tr td {
      border: none;
    }
    tr:nth-child(even) {
      background: #fbfbfb;
    }
    tr:hover {
      background: white;
    }
    tr:last-child td {
      border-bottom: none;
    }
    tr:active td {
      background: ${opacity(colors.blue, 0.09)} !important;
    }
    tr:hover td {
      background: ${opacity(colors.blue, 0.05)};
    }
    .MuiTableCell-body {
      color: inherit;
    }
  }
`;

function resolveSort(queryParams: ?ObjectParameters) {
  return {
    orderBy: (queryParams && queryParams.orderBy) || null,
    order: (queryParams && queryParams.order) || null,
  };
}

function resolveDirection(
  potentialDirection: ObjectParameter | $ReadOnlyArray<ObjectParameter>,
): Direction {
  return potentialDirection === "asc"
    ? "asc"
    : potentialDirection === "desc"
    ? "desc"
    : null;
}
