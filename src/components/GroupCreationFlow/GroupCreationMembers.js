// @flow
import React, { PureComponent } from "react";
import Box from "components/base/Box";
import SelectGroupsUsers from "components/SelectGroupsUsers";

import type { User } from "data/types";
import type { GroupCreationStepProps } from "./types";

type Props = GroupCreationStepProps & {};

class GroupCreationMembers extends PureComponent<Props> {
  onChange = (data: { members: User[] }) => {
    const { updatePayload } = this.props;
    updatePayload({ members: data.members });
  };

  render() {
    const { payload, operators } = this.props;
    const listOperators = operators.edges.map(e => e.node);
    return (
      <Box>
        <SelectGroupsUsers
          members={listOperators}
          value={{ members: payload.members, group: [] }}
          onChange={this.onChange}
        />
      </Box>
    );
  }
}

export default GroupCreationMembers;
