import React from "react";
import _ from "lodash";
import PropTypes from "prop-types";
import ApprovalList from "../../ApprovalList";

function OperationApproveApprovals(props) {
  const { account, operation, members } = props;

  const approvers = [];
  _.map(account.security_scheme.approvers, approver => {
    const member = _.find(members, m => m.pub_key === approver);
    if (member) {
      approvers.push(member);
    }
  });
  const quorum = account.security_scheme.quorum;

  return (
    <ApprovalList
      approvers={approvers}
      approved={operation.approved}
      nbRequired={quorum}
    />
  );
}

OperationApproveApprovals.propTypes = {
  operation: PropTypes.shape({}),
  account: PropTypes.shape({}),
  members: PropTypes.arrayOf(PropTypes.shape({}))
};

export default OperationApproveApprovals;
