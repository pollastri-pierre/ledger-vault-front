// @flow

import React, { PureComponent } from "react";
import Box from "components/base/Box";
import ListGroupMembers from "components/ListGroupMembers";
import Text from "components/base/Text";
import type { Group, User } from "data/types";
import type { Connection } from "restlay/ConnectionQuery";

type Props = {
  close: Function,
  group: Group,
  operators: Connection<User>,
};

class GroupEditRequest extends PureComponent<Props> {
  onSuccess = () => {
    const { close } = this.props;
    close();
  };

  render() {
    const { group, operators } = this.props;
    const listOperators = operators.edges.map(e => e.node);
    return (
      <Box flow={20}>
        <Text bold> Members</Text>
        <ListGroupMembers
          allUsers={listOperators}
          users={group.members}
          editUsers={
            group.last_request && group.last_request.edit_data
              ? group.last_request.edit_data.members
              : undefined
          }
        />
      </Box>
    );
  }
}

export default GroupEditRequest;
