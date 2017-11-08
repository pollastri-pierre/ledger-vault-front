//@flow
import React from "react";
import People from "./People";
import ValidateBadge from "./ValidateBadge";
import Rates from "./Rates";
import Hourglass from "./Hourglass";

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
