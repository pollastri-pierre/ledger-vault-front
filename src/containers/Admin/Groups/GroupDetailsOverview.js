// @flow

import React, { PureComponent } from "react";
import Box from "components/base/Box";
import Text from "components/base/Text";
import type { Group, Member } from "data/types";
import SelectGroupsUsers from "components/SelectGroupsUsers";
import GroupDetailsDetails from "containers/Admin/Groups/GroupDetailsDetails";
import type { Connection } from "restlay/ConnectionQuery";

type Props = {
  group: Group,
  selected: Member[],
  operators: Connection<Member>,
  onGroupChange: ({ groups: Group[], members: Member[] }) => void
};

class GroupDetailsOverview extends PureComponent<Props> {
  render() {
    const { group, operators, onGroupChange, selected } = this.props;
    // TODO need an endpoint not paginated for this
    const listOperators = operators.edges.map(e => e.node);
    return (
      <Box flow={20}>
        <GroupDetailsDetails group={group} />
        <Box flow={20}>
          <Text bold>Members</Text>
          <SelectGroupsUsers
            isDisabled={group.status !== "APPROVED"}
            groups={[]}
            members={listOperators}
            value={{ members: selected, group: [] }}
            onChange={onGroupChange}
          />
        </Box>
      </Box>
    );
  }
}

export default GroupDetailsOverview;
