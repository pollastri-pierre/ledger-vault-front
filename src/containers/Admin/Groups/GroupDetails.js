// @flow

import React, { PureComponent } from "react";
import connectData from "restlay/connectData";
import GroupQuery from "api/queries/GroupQuery";
import MembersQuery from "api/queries/MembersQuery";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "components/base/Box";
import Text from "components/base/Text";
import type { Group, Member } from "data/types";
import GroupDetailsOverview from "containers/Admin/Groups/GroupDetailsOverview";
import GroupDetailsAccounts from "containers/Admin/Groups/GroupDetailsAccounts";
import GroupDetailsDescription from "containers/Admin/Groups/GroupDetailsDescription";
import GroupDetailsFooter from "containers/Admin/Groups/GroupDetailsFooter";

import ModalLoading from "components/ModalLoading";
import {
  ModalHeader,
  ModalTitle,
  ModalBody,
  ModalFooter
} from "components/base/Modal";

type Props = {
  group: Group,
  operators: Member[],
  close: Function
};

type State = {
  tabsIndex: number,
  members: Member[]
};

const tabTitles = ["Overview", "Description", "Accounts"];

class GroupModal extends PureComponent<Props, State> {
  state: State = {
    tabsIndex: 0,
    members: this.props.group.members
  };

  onTabChange = (e, tabsIndex: number) => {
    this.setState({ tabsIndex });
  };

  onGroupChange = (val: { groups: Group[], members: Member[] }) => {
    this.setState({ members: val.members });
  };

  render() {
    const { close, group, operators } = this.props;
    const { tabsIndex, members } = this.state;

    return (
      <ModalBody height={700} onClose={close}>
        <ModalHeader title={group.name}>
          <ModalTitle>{group.name}</ModalTitle>
          <Tabs
            indicatorColor="primary"
            value={tabsIndex}
            onChange={this.onTabChange}
          >
            {tabTitles.map((title, i) => (
              <Tab
                key={i} // eslint-disable-line react/no-array-index-key
                label={title}
                disableRipple
              />
            ))}
          </Tabs>
        </ModalHeader>
        {tabsIndex === 0 && (
          <GroupDetailsOverview
            group={group}
            selected={members}
            operators={operators}
            onGroupChange={this.onGroupChange}
          />
        )}
        {tabsIndex === 1 && <GroupDetailsDescription group={group} />}
        {tabsIndex === 2 && <GroupDetailsAccounts group={group} />}
        <ModalFooter justify="space-between">
          <GroupDetailsFooter group={group} selected={members} close={close} />
        </ModalFooter>
      </ModalBody>
    );
  }
}

const RenderError = () => (
  <Box width={450} height={700}>
    <Text>ERROR</Text>
  </Box>
);

const RenderLoading = () => <ModalLoading height={700} />;
export default connectData(GroupModal, {
  RenderError,
  RenderLoading,
  queries: {
    group: GroupQuery,
    operators: MembersQuery
  },
  propsToQueryParams: props => ({
    groupId: props.match.params.groupId || "",
    memberRole: "operator"
  })
});
