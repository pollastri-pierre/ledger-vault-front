// @flow

import React, { PureComponent } from "react";
import connectData from "restlay/connectData";
import GroupQuery from "api/queries/GroupQuery";
import MembersQuery from "api/queries/MembersQuery";
import Text from "components/base/Text";
import Box from "components/base/Box";
import type { Group, Member } from "data/types";
import SelectGroupsUsers from "components/SelectGroupsUsers";
import ModalHeader from "components/base/Modal/ModalHeader";
import ModalBody from "components/base/Modal/ModalBody";

type Props = {
  group: Group,
  operators: Member[],
  close: Function
};

class GroupModal extends PureComponent<Props> {
  onChange = () => {};

  render() {
    const { close, group, operators } = this.props;
    return (
      <Box width={500}>
        <ModalHeader onClose={close} title={group.name} />
        <ModalBody>
          <Box>
            <Text bold>Members</Text>
            <SelectGroupsUsers
              groups={[]}
              members={operators}
              value={{ members: group.members, group: [] }}
              onChange={this.onChange}
            />
          </Box>
        </ModalBody>
      </Box>
    );
  }
}

const RenderLoading = () => <Text>Render loading todo</Text>;
const RenderError = () => <Text>Render error todo</Text>;

export default connectData(GroupModal, {
  RenderError,
  RenderLoading,
  queries: {
    group: GroupQuery,
    operators: MembersQuery
  },
  propsToQueryParams: props => ({
    groupId: props.match.params.groupId || "",
    userRole: "operator"
  })
});
