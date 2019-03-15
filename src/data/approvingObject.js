// @flow
import moment from "moment";

export type ApprovingObject = {
  // this is a Operation like
  approvedTime: ?string,
  endOfTimeLockTime: ?string,
  endOfRateLimiterTime: ?string,
};
export type ApprovingObjectMeta = {
  rateLimiterRemaining: ?string,
  timeLockRemaining: ?string,
  globalEndTextRemaining: string,
  globalPercentage: number, // progress value from 0 to 1
};

function formatRemainingTimeText(futureTime: number): string {
  return `${moment().to(futureTime, true)} left`;
}

export function calculateApprovingObjectMeta({
  approvedTime,
  endOfTimeLockTime,
  endOfRateLimiterTime,
}: ApprovingObject): ?ApprovingObjectMeta {
  if (approvedTime) {
    const nowT = Date.now();
    const approvedT = Math.min(nowT, new Date(approvedTime).getTime());
    const endOfTimeLockTimeT = endOfTimeLockTime
      ? new Date(endOfTimeLockTime)
      : 0;
    const endOfRateLimiterTimeT = endOfRateLimiterTime
      ? new Date(endOfRateLimiterTime)
      : 0;
    const globalEndT = Math.max(endOfTimeLockTimeT, endOfRateLimiterTimeT);
    if (globalEndT > approvedT) {
      return {
        globalPercentage: Math.max(
          0,
          Math.min((nowT - approvedT) / (globalEndT - approvedT), 1),
        ),
        globalEndTextRemaining: formatRemainingTimeText(globalEndT),
        timeLockRemaining: !endOfTimeLockTime
          ? null
          : formatRemainingTimeText(endOfTimeLockTimeT),
        rateLimiterRemaining: !endOfRateLimiterTime
          ? null
          : formatRemainingTimeText(endOfRateLimiterTimeT),
      };
    }
  }
}
