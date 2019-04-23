// @flow

import React, { PureComponent } from "react";
import connectData from "restlay/connectData";
import GroupQuery from "api/queries/GroupQuery";
import type { Match } from "react-router-dom";
import UsersQuery from "api/queries/UsersQuery";
import { withRouter } from "react-router-dom";
import type { Group, User } from "data/types";
import type { MemoryHistory } from "history";
import type { Connection } from "restlay/ConnectionQuery";
import GoBack from "components/GoBack";
import Button from "components/base/Button";
import GroupDetailsOverview from "containers/Admin/Groups/GroupDetailsOverview";
import GroupDetailsAccounts from "containers/Admin/Groups/GroupDetailsAccounts";
import GroupHistory from "containers/Admin/Groups/GroupHistory";
import colors from "shared/colors";
import EntityLastRequest from "components/EntityLastRequest";
import GroupDetailsFooter from "containers/Admin/Groups/GroupDetailsFooter";
import styled from "styled-components";
import ModalLoading from "components/ModalLoading";
import Box from "components/base/Box";
import Text from "components/base/Text";
import { FaUsers } from "react-icons/fa";

import { hasPendingRequest } from "utils/entities";
import { MdEdit } from "react-icons/md";
import { ModalClose } from "components/base/Modal";

type Props = {
  history: MemoryHistory,
  group: Group,
  operators: Connection<User>,
  close: Function,
  match: Match,
};

class GroupModal extends PureComponent<Props> {
  onTabChange = (tabsIndex: number) => {
    const { history } = this.props;
    const current = location.pathname.split("/");
    current[current.length - 1] = `${tabsIndex}`;
    // we use replace instead of push, because we want "prev" history close the modal
    history.replace(`${current.join("/")}`);
  };

  editGroup = () => {
    const { history, group, match } = this.props;
    if (match.params["0"]) {
      history.push(`${match.params["0"]}/groups/edit/${group.id}`);
    }
  };

  EditTab: (Group, number) => React$Node = (group, tabsIndex) => {
    return (
      <Box horizontal align="center" flow={20}>
        {hasPendingRequest(group) ? (
          <TabName
            isActive={tabsIndex === 3}
            onClick={() => this.onTabChange(3)}
          >
            <Text uppercase small>
              LAST REQUEST
            </Text>
          </TabName>
        ) : (
          group.status === "ACTIVE" && (
            <Box>
              <Button
                size="tiny"
                onClick={this.editGroup}
                variant="filled"
                IconLeft={MdEdit}
                customColor={colors.ocean}
                data-test="group_edit_button"
              >
                edit
              </Button>
            </Box>
          )
        )}
      </Box>
    );
  };

  render() {
    const { close, group, operators } = this.props;

    const tabsIndex =
      (this.props.match.params.tabIndex &&
        parseInt(this.props.match.params.tabIndex, 10)) ||
      0;

    return (
      <Box width={700} style={{ minHeight: 600 }} position="relative">
        <ModalClose onClick={close} />
        <Box bg="#f5f5f5" p={40} pb={0} flow={20} style={styles.header}>
          <Box horizontal align="center" flow={10}>
            <FaUsers size={24} color="#ddd" />
            <Text large color="#aaa">
              {group.name}
            </Text>
          </Box>
          <Box horizontal flow={15} justify="space-between">
            <Box horizontal align="center">
              <TabName
                isActive={tabsIndex === 0}
                onClick={() => this.onTabChange(0)}
              >
                <Text uppercase small>
                  Overview
                </Text>
              </TabName>
              {group.status === "ACTIVE" && (
                <TabName
                  isActive={tabsIndex === 1}
                  onClick={() => this.onTabChange(1)}
                >
                  <Text uppercase small>
                    Accounts
                  </Text>
                </TabName>
              )}
              <TabName
                isActive={tabsIndex === 2}
                onClick={() => this.onTabChange(2)}
              >
                <Text uppercase small>
                  History
                </Text>
              </TabName>
            </Box>
            {this.EditTab(group, tabsIndex)}
          </Box>
        </Box>
        <Box grow p={40} pb={100} style={styles.content}>
          {tabsIndex === 0 && (
            <GroupDetailsOverview
              group={group}
              operators={operators}
              close={close}
            />
          )}
          {tabsIndex === 1 && <GroupDetailsAccounts group={group} />}
          {tabsIndex === 2 && <GroupHistory group={group} />}
          {tabsIndex === 3 && (
            <EntityLastRequest
              entity={group}
              additionalFields={{ operators: operators.edges.map(o => o.node) }}
            />
          )}
        </Box>
        <Box px={10} style={styles.footer}>
          <GroupDetailsFooter
            group={group}
            close={close}
            tabsIndex={tabsIndex}
          />
        </Box>
      </Box>
    );
  }
}

const RenderError = ({
  history,
  match,
}: {
  history: MemoryHistory,
  match: Match,
}) => <GoBack history={history} match={match} />;

const RenderLoading = () => <ModalLoading height={100} width={100} />;

// useful for storybook
const StoryProxy = ({
  withoutRouter,
  ...props
}: Props & {
  withoutRouter: boolean,
}) => {
  if (withoutRouter) {
    return <GroupModal {...props} />;
  }
  const Comp = withRouter(p => <GroupModal {...props} {...p} />);
  return <Comp />;
};

export default connectData(StoryProxy, {
  RenderError,
  RenderLoading,
  queries: {
    group: GroupQuery,
    operators: UsersQuery,
  },
  propsToQueryParams: props => ({
    groupId: props.match.params.groupId || "",
    role: "OPERATOR",
  }),
});

const styles = {
  header: {
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    userSelect: "none",
  },
  footer: {
    padding: 0,
  },
  content: {
    userSelect: "none",
  },
  checkOrNumber: {
    width: 10,
  },
};

export const TabName = styled(Box).attrs({
  horizontal: true,
  align: "center",
  flow: 5,
  p: 12,
})`
  background: ${p => (p.isActive ? "white" : "inherit")};
  border-top-right-radius: 2px;
  border-top-left-radius: 2px;
  box-shadow: ${p => (p.isActive ? "2px -2px 3px #eceaea" : "none")};
  font-weight: ${p => (p.isActive ? "bold" : "normal")};
  opacity: ${p => (p.isActive ? "1" : "0.5")};
  &:hover {
    cursor: pointer;
    opacity: 1;
    color: #555;
  }
`;
