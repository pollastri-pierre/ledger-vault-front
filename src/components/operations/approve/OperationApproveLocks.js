//@flow
import React from "react";
import InfoModal from "../../InfoModal";
import ApproveLockRow from "../../ApproveLockRow";
import Hourglass from "../../icons/thin/Hourglass";
import ValidateBadge from "../../icons/ValidateBadge";
import Rates from "../../icons/thin/Rates";
import LocksPercentage from "../../LocksPercentage";
import type { Account, Operation } from "../../../data/types";

function OperationApproveLocks(props: {
  operation: Operation,
  account: Account
}) {
  const { operation, account } = props;
  const isUnactive = operation.approved.length < account.security_scheme.quorum;

  return (
    <div>
      <InfoModal>
        Funds will be spent when required approvals have been collected from the
        account{"'"}s members and locks have completed
      </InfoModal>
      {account.security_scheme.rate_limiter && (
        <ApproveLockRow
          icon={<Rates height="30px" stroke="#e2e2e2" strokeWidth="2px" />}
          name="Time-lock"
          value="24 hours delay"
          state="15 hours left"
          unactive={isUnactive}
        />
      )}

      {account.security_scheme.time_lock && (
        <ApproveLockRow
          icon={
            <Hourglass
              width="25px"
              height="25px"
              stroke="#cccccc"
              strokeWidth="2px"
            />
          }
          name="Rate Limiter"
          value="2 operations per hour"
          state={<ValidateBadge className="confirmed" />}
          unactive={isUnactive}
        />
      )}
      {isUnactive ? <LocksPercentage /> : <LocksPercentage percentage={0.5} />}
    </div>
  );
}

export default OperationApproveLocks;
