//@flow
import React from "react";
import People from "./People";
import PeopleThin from "./thin/People";
import ValidateBadge from "./ValidateBadge";
import Rates from "./Rates";
import RatesThin from "./thin/Rates";
import Plug from "./thin/Plug";
import Trash from "./thin/Trash";
import Home from "./full/Home";
import Plus from "./full/Plus";
import Lines from "./full/Lines";
import Bell from "./thin/Bell";
import Settings from "./full/Settings";
import Share from "./full/Share";
import Search from "./full/Search";
import Hourglass from "./Hourglass";
import HourglassThin from "./thin/Hourglass";

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

export function MenuDashboardIcon(props: *) {
  return <Home className="menu-icon-dashboard" {...props} />;
}

export function MenuPendingIcon(props: *) {
  return <Lines className="menu-icon-pending" {...props} />;
}

export function MenuSearchIcon(props: *) {
  return <Search className="menu-icon-search" {...props} />;
}
export function MenuNewOperationIcon(props: *) {
  return <Plus className="menu-icon-new-operation" {...props} />;
}

export function ActionAddAccountIcon(props: *) {
  return <Plus className="actionbar-icon-new-account" {...props} />;
}

export function ActionExportIcon(props: *) {
  return <Share className="actionbar-icon-export" {...props} />;
}
export function ActionSettingsIcon(props: *) {
  return <Settings className="actionbar-icon-settings" {...props} />;
}

export function ActionActivityIcon(props: *) {
  return <Bell className="actionbar-icon-activity" {...props} />;
}

export function BigSecurityRateLimiterIcon() {
  return (
    <RatesThin
      stroke="#e2e2e2"
      className="security-icon security-ratelimiter-big-icon"
    />
  );
}
