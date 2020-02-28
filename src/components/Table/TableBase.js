// @flow

import React, { PureComponent } from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import styled from "styled-components";
import type { ObjectParameters, ObjectParameter } from "query-string";

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
      <thead>
        <TableRow>
          {tableDefinition.map(item => (
            <HeaderCellComponent
              key={item.body.prop}
              item={item}
              onSortChange={onSortChange}
              queryParams={queryParams}
              size={item.body.size}
            />
          ))}
        </TableRow>
      </thead>
    );
  }
}

type Props = {
  item: TableItem,
  onSortChange?: (string, ?string) => void,
  queryParams?: ObjectParameters,
  size?: string,
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
    const { item, queryParams, onSortChange, size } = this.props;
    const { orderBy, order } = resolveSort(queryParams);
    const direction = resolveDirection(
      orderBy === item.body.prop ? order : null,
    );
    return (
      <HeaderCell align={item.header.align} key={item.body.prop} size={size}>
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

const HeaderCell = styled.td`
  background-color: ${colors.form.bg};
  border-top: none !important;
  border-bottom-color: ${colors.legacyLightGrey1};
  width: ${p => (p.size === "small" ? "50px" : "auto")};
  padding: ${p => (p.size === "small" ? "10px" : "4px 56px 4px 24px")};
  text-align: ${p => p.align || "left"};
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  tr td {
    border: none;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
  }
  tr:last-child td {
    border-bottom: none;
  }
`;

export const TableRow = styled.tr`
  height: 48px;
  ${p =>
    p.onClick
      ? `
    cursor: pointer;
    &:hover td {
      background: ${opacity(colors.bLive, 0.03)};
    }
    &:active td {
      transition: 100ms linear background;
      background: ${opacity(colors.bLive, 0.09)} !important;
    }
  `
      : ""}
`;

export const TableCell = styled.td`
  padding: ${p => (p.size === "small" ? "10px" : "4px 56px 4px 24px")};
  text-align: ${p => p.align || "left"};
  width: ${p => (p.size === "small" ? "50px" : "auto")};
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
