// @flow

import React, { PureComponent } from "react";
import intersectionWith from "lodash/intersectionWith";
import type { User } from "data/types";
import ListUsers from "components/ListUsers";

type Id = number;
type Props = {
  allUsers: User[],
  users: User[],
  editUsers?: Id[],
};

class ListGroupMembers extends PureComponent<Props> {
  render() {
    const { allUsers, editUsers, users } = this.props;

    let usersWithHistory;
    if (editUsers) {
      const removed = users
        .filter((o) => editUsers.indexOf(o.id) === -1)
        .map((user) => ({
          user,
          history: "removed",
        }));

      const added = editUsers
        .filter((uId) => !users.find((u) => u.id === uId))
        .map((id) => allUsers.find((u) => u.id === id))
        .filter(Boolean)
        .map((user) => ({ user, history: "added" }));

      // $FlowFixMe : flow does not get that a refers to Ids and b to Users
      const unchanged = intersectionWith(editUsers, users, (a, b) => a === b.id)
        .map((id) => allUsers.find((u) => u.id === id))
        .filter(Boolean)
        .map((user) => ({ user, history: "unchanged" }));

      usersWithHistory = [...removed, ...added, ...unchanged];
    } else {
      usersWithHistory = users.map((user) => ({ user, history: "unchanged" }));
    }

    return <ListUsers usersWithHistory={usersWithHistory} />;
  }
}

export default ListGroupMembers;
