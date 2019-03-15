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
  data: Group[],
  onRowClick: Group => void,
};

class GroupsTable extends PureComponent<Props> {
  Group = (group: Group) => {
    const { onRowClick } = this.props;

    const key = `${group.id}`;

    return <GroupRow key={key} group={group} onClick={onRowClick} />;
  };

  render() {
    const { data } = this.props;

    if (!data.length) {
      return <NoDataPlaceholder title="No groups found." />;
    }

    return (
      <TableScroll>
        <MUITable>
          <GroupsTableHeader />
          <MUITableBody>{data.map(this.Group)}</MUITableBody>
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
  onClick: Group => void,
};

const styles = {
  groupRowHover: { cursor: "pointer" },
  noWrap: {
    whiteSpace: "nowrap",
  },
};

class GroupRow extends PureComponent<GroupRowProps> {
  handleClick = () => {
    this.props.onClick(this.props.group);
  };

  render() {
    const { group, onClick } = this.props;

    return (
      <MUITableRow
        hover={!!onClick}
        style={onClick ? styles.groupRowHover : undefined}
        onClick={onClick ? this.handleClick : undefined}
      >
        <MUITableCell>
          <DateFormat format="ddd D MMM, h:mmA" date={group.created_on} />
        </MUITableCell>

        <MUITableCell style={styles.noWrap}>{group.name}</MUITableCell>
        <MUITableCell>{group.members && group.members.length}</MUITableCell>
        <MUITableCell>
          <EntityStatus
            status={group.status}
            request={group.last_request && group.last_request}
          />
        </MUITableCell>
      </MUITableRow>
    );
  }
}

export default GroupsTable;
