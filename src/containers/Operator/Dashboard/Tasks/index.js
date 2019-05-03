// @flow

import React, { PureComponent } from "react";

import connectData from "restlay/connectData";
import styled from "styled-components";
import type { MemoryHistory } from "history";

import MyRequestsQuery from "api/queries/MyRequestsQuery";

import NoDataPlaceholder from "components/NoDataPlaceholder";
import Text from "components/base/Text";
import Box from "components/base/Box";
import { CardLoading, CardError } from "components/base/Card";

import colors from "shared/colors";

import TaskRow from "./TaskRow";
import { mockTasks, accounts } from "./helpers";

const TaskRowContainer = styled(Box).attrs({
  horizontal: true,
})`
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 48px;

  &:last-child {
    border-bottom: 0;
  }

  &:hover {
    background: #eee;
    cursor: pointer;
  }
`;

type Props = {
  tasks: *,
  history: MemoryHistory,
};
const styles = {
  seeAll: {
    position: "absolute",
    right: 10,
    top: 10,
    cursor: "pointer",
  },
};

class Tasks extends PureComponent<Props> {
  handleTaskClick = () => {
    // TODO: push to the common request details url segregated to operators
    // match and history is already passed as props
  };

  handleSeeAllTasks = () => {
    const { history } = this.props;
    history.push("transactions?pageSize=30&status=PENDING_APPROVAL");
  };

  render() {
    const { tasks } = this.props;
    const displayTasks =
      tasks && tasks.length > 0 ? tasks.slice(0, 3) : mockTasks;
    return (
      <>
        <Box flow={15} p={10}>
          <Box p={10} style={styles.seeAll} onClick={this.handleSeeAllTasks}>
            <Text small color={colors.ocean}>
              see all
            </Text>
          </Box>
          <Text bold i18nKey="operatorDashboard:tasks.header" />
          {displayTasks ? (
            <Box>
              {displayTasks.map(task => (
                <TaskRowContainer onClick={this.handleTaskClick} key={task.id}>
                  <TaskRow task={task} accounts={accounts} />
                </TaskRowContainer>
              ))}
            </Box>
          ) : (
            <NoDataPlaceholder happy title="No tasks found." />
          )}
        </Box>
      </>
    );
  }
}

export default connectData(Tasks, {
  RenderLoading: CardLoading,
  RenderError: CardError,
  queries: {
    tasks: MyRequestsQuery,
  },
});
