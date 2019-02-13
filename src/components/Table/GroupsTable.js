// @flow

import React, { PureComponent } from "react";

import MUITable from "@material-ui/core/Table";
import MUITableBody from "@material-ui/core/TableBody";
import MUITableCell from "@material-ui/core/TableCell";
import MUITableHead from "@material-ui/core/TableHead";
import MUITableRow from "@material-ui/core/TableRow";

import EntityStatus from "components/EntityStatus";
import DateFormat from "components/DateFormat";
import NoDataPlaceholder from "components/NoDataPlaceholder";

import type { Group } from "data/types";

import TableScroll from "./TableScroll";

type Props = {
  groups: Group[],
  onGroupClick: Group => void
};

class GroupsTable extends PureComponent<Props> {
  Group = (group: Group) => {
    const { onGroupClick } = this.props;

    const key = `${group.id}`;

    return <GroupRow key={key} group={group} onClick={onGroupClick} />;
  };

  render() {
    const { groups } = this.props;

    if (!groups.length) {
      return <NoDataPlaceholder title="No groups" />;
    }

    return (
      <TableScroll>
        <MUITable>
          <GroupsTableHeader />
          <MUITableBody>{groups.map(this.Group)}</MUITableBody>
        </MUITable>
      </TableScroll>
    );
  }
}

type GroupsTableHeaderProps = {};

class GroupsTableHeader extends PureComponent<GroupsTableHeaderProps> {
  render() {
    return (
      <MUITableHead>
        <MUITableRow>
          <MUITableCell>Date</MUITableCell>
          <MUITableCell>Group</MUITableCell>
          <MUITableCell>Users</MUITableCell>
          <MUITableCell>Status</MUITableCell>
        </MUITableRow>
      </MUITableHead>
    );
  }
}

type GroupRowProps = {
  group: Group,
  onClick: Group => void
};

const groupRowHover = { cursor: "pointer" };

class GroupRow extends PureComponent<GroupRowProps> {
  handleClick = () => {
    this.props.onClick(this.props.group);
  };

  render() {
    const { group, onClick } = this.props;

    return (
      <MUITableRow
        hover={!!onClick}
        style={onClick ? groupRowHover : undefined}
        onClick={onClick ? this.handleClick : undefined}
      >
        <MUITableCell>
          <DateFormat format="ddd D MMM, h:mmA" date={group.created_on} />
        </MUITableCell>

        <MUITableCell>{group.name}</MUITableCell>
        <MUITableCell>{group.members.length}</MUITableCell>
        <MUITableCell>
          <EntityStatus status={group.status} />
        </MUITableCell>
      </MUITableRow>
    );
  }
}

export default GroupsTable;
