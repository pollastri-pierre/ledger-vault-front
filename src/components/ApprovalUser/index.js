// @flow
import React from "react";
import Box from "components/base/Box";
import Text from "components/base/Text";
import { FaQuestionCircle, FaCheckCircle } from "react-icons/fa";
import type { Member } from "data/types";
import colors from "shared/colors";

const styles = {
  base: {
    borderBottom: `1px solid ${colors.argile}`
  }
};
function ApprovalMember(props: { member: Member, isApproved: boolean }) {
  const { member, isApproved } = props;

  return (
    <Box mx={20} align="center" justify="center" noShrink style={styles.base}>
      <Box horizontal align="center" flow={5}>
        {isApproved ? (
          <FaCheckCircle color={colors.ocean} />
        ) : (
          <FaQuestionCircle color={colors.lightGrey} />
        )}
        <Text dataTest="approvalmember-name">{member.username}</Text>
      </Box>
      <Box align="center" justify="center" mb={30}>
        <Text
          small
          color={colors.shark}
          data-test="approvalmember-status"
          i18nKey={
            isApproved
              ? "pendingAccount:status.approved"
              : "pendingAccount:status.pending"
          }
        />
      </Box>
    </Box>
  );
}

export default ApprovalMember;
