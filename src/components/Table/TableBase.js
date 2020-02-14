// @flow

import React, { PureComponent } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import styled from "styled-components";
import MUITable from "@material-ui/core/Table";
import type { ObjectParameters, ObjectParameter } from "query-string";

import MUITableCell from "@material-ui/core/TableCell";
import MUITableHead from "@material-ui/core/TableHead";
import MUITableRow from "@material-ui/core/TableRow";

import VaultLink from "components/VaultLink";
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
              style={getExtraCellStyle(item.body.prop)}
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
  style?: Object,
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
    const { item, queryParams, onSortChange, style } = this.props;
    const { orderBy, order } = resolveSort(queryParams);
    const direction = resolveDirection(
      orderBy === item.body.prop ? order : null,
    );
    return (
      <HeaderCell align={item.header.align} key={item.body.prop} style={style}>
        {item.header.sortable && onSortChange ? (
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
    background-color: ${colors.form.bg};
    border-bottom-color: ${colors.legacyLightGrey1};
  }
`;

export const Table = styled(MUITable)`
  && {
    user-select: none;
    tr td {
      border: none;
      border-top: 1px solid rgba(0, 0, 0, 0.05);
    }
    tr:hover {
      background: ${colors.white};
    }
    tr:last-child td {
      border-bottom: none;
    }
    tr:active td {
      transition: 100ms linear background;
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

export const OpenExternal = ({ url }: { url: string }) => (
  <OpenExternalContainer>
    <VaultLink
      withRole
      target="_blank"
      to={url}
      onClick={e => e.stopPropagation()}
      title="Open in a new tab"
    >
      <OpenExternalInner>
        <FaExternalLinkAlt />
      </OpenExternalInner>
    </VaultLink>
  </OpenExternalContainer>
);

const OpenExternalContainer = styled.div`
  a {
    outline: none;
    color: ${colors.lightGrey};
    &:hover,
    &:focus {
      color: ${colors.mediumGrey};
    }
    &:active {
      color: ${colors.shark};
    }
  }
`;

const OpenExternalInner = styled.div`
  width: 30px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
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

export function getExtraCellStyle(cellID: string) {
  if (cellID === "details") {
    return {
      padding: 10,
      width: 50,
    };
  }
}
