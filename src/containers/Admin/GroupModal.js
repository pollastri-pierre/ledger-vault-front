// @flow

import React, { PureComponent } from "react";
import connectData from "restlay/connectData";
import GroupQuery from "api/queries/GroupQuery";
import Text from "components/base/Text";
import Box from "components/base/Box";
import type { Group } from "data/types";
import ModalHeader from "components/base/Modal/ModalHeader";
import ModalBody from "components/base/Modal/ModalBody";

type Props = {
  group: Group,
  close: Function
};

class GroupModal extends PureComponent<Props> {
  render() {
    const { close, group } = this.props;
    return (
      <Box width={500}>
        <ModalHeader onClose={close} title={group.name} />
        <ModalBody>
          <Box>
            <Text bold>Members</Text>
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
    group: GroupQuery
  },
  propsToQueryParams: props => ({
    groupId: props.match.params.groupId || ""
  })
});
