// @flow

import React, { PureComponent } from "react";

import MUITable from "@material-ui/core/Table";
import MUITableBody from "@material-ui/core/TableBody";
import MUITableCell from "@material-ui/core/TableCell";
import MUITableHead from "@material-ui/core/TableHead";
import MUITableRow from "@material-ui/core/TableRow";

import Status from "components/Status";
import DateFormat from "components/DateFormat";
import NoDataPlaceholder from "components/NoDataPlaceholder";

import type { Member } from "data/types";

import TableScroll from "./TableScroll";

type Props = {
  users: Member[],
  onMemberClick: Member => void
};

class MembersTable extends PureComponent<Props> {
  Member = (user: Member) => {
    const { onMemberClick } = this.props;

    const key = `${user.id}`;

    return <MemberRow key={key} user={user} onClick={onMemberClick} />;
  };

  render() {
    const { users } = this.props;

    if (!users.length) {
      return <NoDataPlaceholder title="No USERS" />;
    }

    return (
      <TableScroll>
        <MUITable>
          <MembersTableHeader />
          <MUITableBody>{users.map(this.Member)}</MUITableBody>
        </MUITable>
      </TableScroll>
    );
  }
}

type MembersTableHeaderProps = {};

class MembersTableHeader extends PureComponent<MembersTableHeaderProps> {
  render() {
    return (
      <MUITableHead>
        <MUITableRow>
          <MUITableCell>Date</MUITableCell>
          <MUITableCell>Membername</MUITableCell>
          <MUITableCell>Member ID</MUITableCell>
          <MUITableCell>Status</MUITableCell>
        </MUITableRow>
      </MUITableHead>
    );
  }
}

type MemberRowProps = {
  user: Member,
  onClick: Member => void
};

const userRowHover = { cursor: "pointer" };

class MemberRow extends PureComponent<MemberRowProps> {
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
        <MUITableCell>{user.id}</MUITableCell>
        <MUITableCell>
          <Status status={user.status} />
        </MUITableCell>
      </MUITableRow>
    );
  }
}

export default MembersTable;
