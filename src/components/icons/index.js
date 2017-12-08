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
import injectSheet from "react-jss";

import colors from "../../shared/colors";

export function SecurityMembersIcon() {
  return <People />;
}

export function SecurityQuorumIcon() {
  return <ValidateBadge />;
}

export function SecurityRateLimiterIcon() {
  return <Rates />;
}

export function SecurityTimelockIcon() {
  return <Hourglass />;
}

export function PlugIcon(props: *) {
  return <Plug />;
}

export function TrashIcon(props: *) {
  return <Trash />;
}

export function BigSecurityTimeLockIcon() {
  return <HourglassThin />;
}

export function BigSecurityMembersIcon() {
  return <PeopleThin />;
}

export function MenuDashboardIcon() {
  return <Home type="black" />;
}

export function MenuPendingIcon() {
  return <Lines type="black" />;
}

export function MenuSearchIcon() {
  return <Search type="black" />;
}
export function MenuNewOperationIcon(props: *) {
  return <Plus type="menu" />;
}

export function ActionAddAccountIcon() {
  return <Plus type="header" />;
}

export function ActionExportIcon() {
  return <Share type="white" />;
}
export function ActionSettingsIcon() {
  return <Settings type="white" />;
}

export function ActionActivityIcon() {
  return <Bell type="white" />;
}

export function BigSecurityRateLimiterIcon() {
  return <RatesThin stroke={colors.mouse} />;
}
