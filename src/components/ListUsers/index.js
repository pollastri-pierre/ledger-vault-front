// @flow

import React, { PureComponent } from "react";
import type { User } from "data/types";
import Box from "components/base/Box";
import Text from "components/base/Text";
import colors from "shared/colors";
import { FiUserPlus, FiUserMinus, FiUser } from "react-icons/fi";

type History = "unchanged" | "added" | "removed";

type UserWithHistory = { user: User, history: History };
type Props = {
  usersWithHistory: UserWithHistory[],
};

const SIZE = 13;
const grid = {
  display: "grid",
  gridGap: 10,
  gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr) )",
};

const unchangedIcon = <FiUser size={SIZE} />;
const addedIcon = <FiUserPlus size={SIZE} color={colors.ocean} />;
const removedIcon = <FiUserMinus size={SIZE} color={colors.grenade} />;

const ICON_BY_HISTORY: { [_: History]: React$Node } = {
  unchanged: unchangedIcon,
  added: addedIcon,
  removed: removedIcon,
};

const Item = ({ user }: { user: UserWithHistory }) => (
  <Box horizontal align="center" flow={5}>
    {ICON_BY_HISTORY[user.history]}
    <Text size="small">{user.user.username}</Text>
  </Box>
);

class ListUsers extends PureComponent<Props> {
  render() {
    const { usersWithHistory } = this.props;
    return (
      <div style={grid}>
        {usersWithHistory.map((u) => (
          <Item user={u} key={u.user.id} />
        ))}
      </div>
    );
  }
}

export default ListUsers;
