// @flow

export const isMemberOfFirstApprovalStep = () => {
  console.warn(
    "isMemberOfFirstApprovalStep set to true, transitioning from tx_approval_steps to governance_rules",
  );
  return true;
};
