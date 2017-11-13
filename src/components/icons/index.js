//@flow
import React from "react";
import People from "./People";
import PeopleThin from "./thin/People";
import ValidateBadge from "./ValidateBadge";
import Rates from "./Rates";
import Plug from "./thin/Plug";
import Trash from "./thin/Trash";
import Hourglass from "./Hourglass";
import HourglassThin from "./thin/Hourglass";

import "./index.css";

export function SecurityMembersIcon() {
  return <People className="security-icon security-members-icon" />;
}

export function SecurityQuorumIcon() {
  return <ValidateBadge className="security-icon security-quorum-icon" />;
}

export function SecurityRateLimiterIcon() {
  return <Rates className="security-icon security-ratelimiter-icon" />;
}

export function SecurityTimelockIcon() {
  return <Hourglass className="security-icon security-timelock-icon" />;
}

export function PlugIcon(props: *) {
  return <Plug className="plug-icon" {...props} />;
}

export function TrashIcon(props: *) {
  return <Trash className="trash-icon" {...props} />;
}

export function BigSecurityTimeLockIcon() {
  return <HourglassThin className="security-icon security-timelock-big-icon" />;
}

export function BigSecurityMembersIcon() {
  return <PeopleThin className="security-icon security-members-big-icon" />;
}

export function BigSecurityRateLimiterIcon() {
  return <PeopleThin className="security-icon security-ratelimiter-big-icon" />;
}
