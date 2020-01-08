// @flow

import React, { PureComponent } from "react";
import Box from "components/base/Box";
import ListGroupMembers from "components/ListGroupMembers";
import Text from "components/base/Text";
import type { Group, User } from "data/types";
import DiffName from "components/DiffName";

type Props = {
  group: Group,
  operators: User[],
};

class GroupEditRequest extends PureComponent<Props> {
  render() {
    const { group, operators } = this.props;
    return (
      <Box flow={20}>
        <DiffName entity={group} />
        <Box flow={15}>
          <Text fontWeight="bold">Members</Text>
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

export default GroupEditRequest;
