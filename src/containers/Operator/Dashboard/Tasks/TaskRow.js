// @flow

import React, { PureComponent, Fragment } from "react";

import type { Account } from "data/types";

import TaskStatus from "./TaskStatus";
import TaskAccountName from "./TaskAccountName";
import TaskAmount from "./TaskAmount";

type Props = {
  task: *,
  accounts: Account[],
};

class TaskRow extends PureComponent<Props> {
  render() {
    const { task, accounts } = this.props;
    const account = accounts.find(
      account => account.id === task.transaction.account_id,
    );

    return (
      <Fragment>
        <TaskStatus task={task} />
        {account && <TaskAccountName account={account} />}
        {account && <TaskAmount task={task} account={account} />}
      </Fragment>
    );
  }
}

export default TaskRow;
