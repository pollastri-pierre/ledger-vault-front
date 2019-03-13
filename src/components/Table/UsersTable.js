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
import UserRoleFormatter from "components/UserRoleFormatter";

import type { Member } from "data/types";

import TableScroll from "./TableScroll";

type Props = {
  data: Member[],
  onRowClick: Member => void
};

// TODO update to the new table
class UsersTable extends PureComponent<Props> {
  User = (user: Member) => {
    const { onRowClick } = this.props;

    const key = `${user.id}`;

    return <UserRow key={key} user={user} onClick={onRowClick} />;
  };

  render() {
    const { data } = this.props;

    if (!data.length) {
      return <NoDataPlaceholder title="No users found." />;
    }

    return (
      <TableScroll>
        <MUITable>
          <UsersTableHeader />
          <MUITableBody>{data.map(this.User)}</MUITableBody>
        </MUITable>
      </TableScroll>
    );
  }
}

type UsersTableHeaderProps = {};

class UsersTableHeader extends PureComponent<UsersTableHeaderProps> {
  render() {
    return (
      <MUITableHead>
        <MUITableRow>
          <MUITableCell>Date</MUITableCell>
          <MUITableCell>Username</MUITableCell>
          <MUITableCell>Role</MUITableCell>
          <MUITableCell>User ID</MUITableCell>
          <MUITableCell>Status</MUITableCell>
        </MUITableRow>
      </MUITableHead>
    );
  }
}

type UserRowProps = {
  user: Member,
  onClick: Member => void
};

const userRowHover = { cursor: "pointer" };

class UserRow extends PureComponent<UserRowProps> {
  handleClick = () => {
    this.props.onClick(this.props.user);
  };

  render() {
    const { user, onClick } = this.props;

    return (
      <MUITableRow
        hover={!!onClick}
        style={onClick ? userRowHover : undefined}
        onClick={onClick ? this.handleClick : undefined}
      >
        <MUITableCell>
          <DateFormat format="ddd D MMM, h:mmA" date={user.created_on} />
        </MUITableCell>
        <MUITableCell>{user.username}</MUITableCell>
        <MUITableCell>
          <UserRoleFormatter userRole={user.role} />
        </MUITableCell>
        <MUITableCell>{user.user_id || ""}</MUITableCell>
        <MUITableCell>
          <EntityStatus
            status={user.status}
            request={user.last_request && user.last_request}
          />
        </MUITableCell>
      </MUITableRow>
    );
  }
}

export default UsersTable;
