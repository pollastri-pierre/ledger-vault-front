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
  members: Member[],
  onMemberClick: Member => void
};

class MembersTable extends PureComponent<Props> {
  Member = (member: Member) => {
    const { onMemberClick } = this.props;

    const key = `${member.id}`;

    return <MemberRow key={key} member={member} onClick={onMemberClick} />;
  };

  render() {
    const { members } = this.props;

    if (!members.length) {
      return <NoDataPlaceholder title="No USERS" />;
    }

    return (
      <TableScroll>
        <MUITable>
          <MembersTableHeader />
          <MUITableBody>{members.map(this.Member)}</MUITableBody>
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
          <MUITableCell>Username</MUITableCell>
          <MUITableCell>User ID</MUITableCell>
          <MUITableCell>Status</MUITableCell>
        </MUITableRow>
      </MUITableHead>
    );
  }
}

type MemberRowProps = {
  member: Member,
  onClick: Member => void
};

const memberRowHover = { cursor: "pointer" };

class MemberRow extends PureComponent<MemberRowProps> {
  handleClick = () => {
    this.props.onClick(this.props.member);
  };

  render() {
    const { member, onClick } = this.props;

    return (
      <MUITableRow
        hover={!!onClick}
        style={onClick ? memberRowHover : undefined}
        onClick={onClick ? this.handleClick : undefined}
      >
        <MUITableCell>
          <DateFormat format="ddd D MMM, h:mmA" date={member.created_on} />
        </MUITableCell>
        <MUITableCell>{member.username}</MUITableCell>
        <MUITableCell>{member.id}</MUITableCell>
        <MUITableCell>
          <Status status={member.status} />
        </MUITableCell>
      </MUITableRow>
    );
  }
}

export default MembersTable;
