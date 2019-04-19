// @flow

import React, { PureComponent } from "react";
import Box from "components/base/Box";
import ListGroupMembers from "components/ListGroupMembers";
import Text from "components/base/Text";
import colors from "shared/colors";
import type { Group, User } from "data/types";
import { FaArrowRight } from "react-icons/fa";

const arrowRight = <FaArrowRight />;

type Props = {
  group: Group,
  operators: User[],
};

class GroupEditRequest extends PureComponent<Props> {
  render() {
    const { group, operators } = this.props;
    return (
      <Box flow={20}>
        <DiffName group={group} />
        <Box flow={15}>
          <Text bold>Members</Text>
          <ListGroupMembers
            allUsers={operators}
            users={group.members}
            editUsers={
              group.last_request && group.last_request.edit_data
                ? group.last_request.edit_data.members
                : undefined
            }
          />
        </Box>
      </Box>
    );
  }
}

const DiffName = ({ group }: { group: Group }) => {
  if (!group.last_request) return null;
  const editName =
    group.last_request.edit_data && group.last_request.edit_data.name;
  if (!editName) return null;

  if (editName === group.name) return null;

  return (
    <Box flow={15}>
      <Text bold>Name</Text>
      <Box horizontal align="center" flow={10}>
        <Text color={colors.grenade}>{group.name}</Text>
        {arrowRight}
        <Text color={colors.ocean}>{editName}</Text>
      </Box>
    </Box>
  );
};
export default GroupEditRequest;
