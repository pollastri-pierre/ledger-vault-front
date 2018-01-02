//@flow

// FIXME drop this file. we should directly import the font we need. also the global className are to be removed

import React from "react";
import Profile from "./thin/Profile";
import PeopleThin from "./thin/People";
import ValidateBadge from "./full/ValidateBadge";
import RatesThin from "./thin/Rates";
import Plug from "./thin/Plug";
import Trash from "./thin/Trash";
import HourglassThin from "./thin/Hourglass";
import ClockThin from "./thin/Clock";

import colors from "../../shared/colors";

export function SecurityMembersIcon() {
  return (
    <PeopleThin
      style={{
        width: "15px"
      }}
      color={colors.mouse}
    />
  );
}

export function SecurityQuorumIcon() {
  return (
    <ValidateBadge
      style={{
        width: "12px"
      }}
      color={colors.mouse}
    />
  );
}

export function SecurityRateLimiterIcon() {
  return <RatesThin style={{ width: "13px" }} color={colors.mouse} />;
}

export function SecurityTimelockIcon() {
  return (
    <HourglassThin
      style={{ width: "12px", strokeWidth: "2px" }}
      color={colors.mouse}
    />
  );
}

export function PlugIcon(props: *) {
  return (
    <Plug
      style={{
        width: "32px",
        height: "20px",
        fill: "none",
        stroke: colors.mouse,
        strokeWidth: "2px"
      }}
      {...props}
    />
  );
}

export function TrashIcon() {
  return (
    <Trash
      style={{
        width: "27px",
        strokeWidth: "2px",
        height: "32px",
        fill: "none",
        stroke: colors.mouse
      }}
    />
  );
}

export function BigSecurityTimeLockIcon() {
  return (
    <HourglassThin
      style={{ width: "28px", height: "30px" }}
      color={colors.mouse}
    />
  );
}

export function BigSecurityMembersIcon() {
  return (
    <Profile style={{ width: "26px", height: "30px" }} color={colors.mouse} />
  );
}

export function BigSecurityRateLimiterIcon() {
  return (
    <RatesThin color={colors.mouse} style={{ width: "25px", height: "30px" }} />
  );
}
export function BigSecurityAutoExpireIcon(props: Props) {
  return (
    <ClockThin
      color={colors.mouse}
      className="security-icon security-autoexpire-big-icon"
      {...props}
    />
  );
}
