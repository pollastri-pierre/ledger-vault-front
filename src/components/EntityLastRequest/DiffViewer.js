// @flow

import React, { PureComponent } from "react";
import Box from "components/base/Box";
import GroupEditRequest from "containers/Admin/Groups/GroupEditRequest";
import AccountEditRequest from "containers/Admin/Accounts/AccountEditRequest";
import type { Entity } from "data/types";

type Props = {
  entity: Entity,
  additionalFields?: Object,
};

const ACCOUNT_TARGET_TYPE = [
  "ERC20_ACCOUNT",
  "BITCOIN_ACCOUNT",
  "ETHEREUM_ACCOUNT",
  "RIPPLE_ACCOUNT",
];
class DiffViewer extends PureComponent<Props> {
  render() {
    const { entity, additionalFields } = this.props;
    if (!entity.last_request) return null;

    const { last_request } = entity;
    return (
      <Box flow={20}>
        {last_request.target_type === "GROUP" && (
          // $FlowFixMe don't know how to tell Flow that entity type if Group
          <GroupEditRequest
            group={entity}
            operators={additionalFields && additionalFields.operators}
          />
        )}
        {ACCOUNT_TARGET_TYPE.indexOf(last_request.target_type) > -1 && (
          // $FlowFixMe don't know how to tell Flow that entity type if Account
          <AccountEditRequest account={entity} />
        )}
      </Box>
    );
  }
}

export default DiffViewer;
