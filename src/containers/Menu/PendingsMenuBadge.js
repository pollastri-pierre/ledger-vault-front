// @flow
import React, { Component } from "react";
import connectData from "restlay/connectData";
import PendingAccountsQuery from "api/queries/PendingAccountsQuery";
import PendingOperationsQuery from "api/queries/PendingOperationsQuery";
import { getPendingsOperations } from "utils/operations";
import colors from "shared/colors";

import type { Account, Operation } from "data/types";

const styles = {
  base: {
    lineHeight: 0,
    alignItems: "center",
    width: 18,
    height: 18,
    display: "flex",
    justifyContent: "center",
    backgroundColor: colors.grenade,
    color: colors.white,
    borderRadius: "1em",
    fontSize: 11,
    fontWeight: "600",
  },
};
type Props = {
  accounts: Account[],
  operations: Operation[],
};
class PendingsMenuBadge extends Component<Props> {
  render() {
    const { accounts, operations } = this.props;
    const filtered = getPendingsOperations(operations);
    const count = accounts.length + filtered.length;
    if (count === 0) {
      return false;
    }
    return <span style={styles.base}>{count}</span>;
  }
}

export default connectData(PendingsMenuBadge, {
  queries: {
    accounts: PendingAccountsQuery,
    operations: PendingOperationsQuery,
  },
});
