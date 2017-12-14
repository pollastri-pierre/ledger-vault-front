//@flow
import React from "react";
import PeopleThin from "./thin/People";
import ValidateBadge from "./full/ValidateBadge";
import RatesThin from "./thin/Rates";
import Plug from "./thin/Plug";
import Trash from "./thin/Trash";
import Home from "./full/Home";
import Plus from "./full/Plus";
import Lines from "./full/Lines";
import Bell from "./full/Bell";
import Settings from "./full/Settings";
import Share from "./full/Share";
import Search from "./full/Search";
import HourglassThin from "./thin/Hourglass";
import ClockThin from "./thin/Clock";

import "./index.css";

type Props = { color?: string };

export function SecurityMembersIcon(props: Props) {
  return (
    <PeopleThin className="security-icon security-members-icon" {...props} />
  );
}

export function SecurityQuorumIcon(props: Props) {
  return (
    <ValidateBadge className="security-icon security-quorum-icon" {...props} />
  );
}

export function SecurityRateLimiterIcon(props: Props) {
  return (
    <RatesThin className="security-icon security-ratelimiter-icon" {...props} />
  );
}

export function SecurityTimelockIcon(props: Props) {
  return (
    <HourglassThin
      className="security-icon security-timelock-icon"
      {...props}
    />
  );
}

export function PlugIcon(props: Props) {
  return <Plug className="plug-icon" {...props} />;
}

export function TrashIcon(props: Props) {
  return <Trash className="trash-icon" {...props} />;
}

export function BigSecurityTimeLockIcon(props: Props) {
  return (
    <HourglassThin
      className="security-icon security-timelock-big-icon"
      {...props}
    />
  );
}

export function BigSecurityMembersIcon(props: Props) {
  return (
    <PeopleThin
      className="security-icon security-members-big-icon"
      {...props}
    />
  );
}

export function MenuDashboardIcon(props: Props) {
  return <Home className="menu-icon-dashboard" {...props} />;
}

export function MenuPendingIcon(props: Props) {
  return <Lines className="menu-icon-pending" {...props} />;
}

export function MenuSearchIcon(props: Props) {
  return <Search className="menu-icon-search" {...props} />;
}
export function MenuNewOperationIcon(props: Props) {
  return <Plus className="menu-icon-new-operation" {...props} />;
}

export function ActionAddAccountIcon(props: Props) {
  return (
    <Plus className="actionbar-icon-new-account" color="#fff" {...props} />
  );
}

export function ActionExportIcon(props: Props) {
  return <Share className="actionbar-icon-export" color="#fff" {...props} />;
}
export function ActionSettingsIcon(props: Props) {
  return (
    <Settings className="actionbar-icon-settings" color="#fff" {...props} />
  );
}

export function ActionActivityIcon(props: Props) {
  return <Bell className="actionbar-icon-activity" color="#fff" {...props} />;
}

export function BigSecurityRateLimiterIcon(props: Props) {
  return (
    <RatesThin
      color="#e2e2e2"
      className="security-icon security-ratelimiter-big-icon"
      {...props}
    />
  );
}

export function BigSecurityAutoExpireIcon(props: Props) {
  return (
    <ClockThin
      color="#e2e2e2"
      className="security-icon security-autoexpire-big-icon"
      {...props}
    />
  );
}
