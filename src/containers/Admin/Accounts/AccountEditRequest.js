// @flow

import React, { PureComponent } from "react";
import Box from "components/base/Box";
import colors, { opacity } from "shared/colors";
import RulesViewer from "components/ApprovalsRules/RulesViewer";
import type { Account } from "data/types";

type Props = {
  account: Account,
};

class AccountEditRequest extends PureComponent<Props> {
  render() {
    const { account } = this.props;
    if (!account.tx_approval_steps) return null;
    return (
      <Box flow={20} horizontal align="center">
        <Box
          width={300}
          bg={opacity(colors.grenade, 0.1)}
          style={{ border: `1px solid ${colors.grenade}`, ...styles }}
        >
          <RulesViewer rules={account.tx_approval_steps} isDiff />
        </Box>
        <Box
          width={300}
          bg={opacity(colors.ocean, 0.1)}
          style={{ border: `1px solid ${colors.ocean}`, ...styles }}
        >
          TODO ( get edit_data from last_request)
        </Box>
      </Box>
    );
  }
}

const styles = {
  borderRadius: 2,
  padding: 5,
};

export default AccountEditRequest;
