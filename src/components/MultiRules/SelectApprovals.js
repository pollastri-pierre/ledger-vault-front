// @flow

import React from "react";
import { useTranslation } from "react-i18next";

import { MAX_MEMBERS } from "components/GroupCreationFlow/GroupCreationInfos";
import SelectGroupsUsers from "components/SelectGroupsUsers";
import { isRequestPending } from "utils/request";
import EntityStatus from "components/EntityStatus";
import type { SelectGroupUsersData } from "components/SelectGroupsUsers";
import type { User, Group } from "data/types";
import type { RuleMultiAuthStep, RuleMultiAuth } from "./types";

type Props = {
  rule: RuleMultiAuth,
  step: RuleMultiAuthStep,
  onChange: RuleMultiAuthStep => void,
  users: User[],
  groups: Group[],
};

const SelectApprovals = (props: Props) => {
  const { rule, step, groups, users, onChange, ...p } = props;
  const { t } = useTranslation();

  const options = filterAvailableOptions(rule, step, groups, users);
  const [filteredGroups, filteredUsers] = options;

  const handleChangeSelect = ({
    groups: selectedGroups,
    members: selectedUsers,
  }: SelectGroupUsersData) => {
    if (!step) return;
    if (!selectedGroups.length && !selectedUsers.length) {
      return onChange({ quorum: 1, group: { is_internal: true, members: [] } });
    }

    const justAddedGroup = !!step.group.is_internal && !!selectedGroups.length;
    const justAddedUser = !step.group.is_internal && !!selectedUsers.length;
    const newStep = { ...step };

    if (justAddedGroup) {
      const selectedGroup = selectedGroups[selectedGroups.length - 1];
      newStep.group = { ...selectedGroup };
    } else if (justAddedUser) {
      newStep.group = {
        is_internal: true,
        members: selectedUsers,
      };
    } else if (newStep.group.is_internal) {
      newStep.group.members = selectedUsers;
    } else {
      const selectedGroup = selectedGroups[selectedGroups.length - 1];
      if (selectedGroup) {
        newStep.group = { ...selectedGroup };
      } else {
        newStep.group = {
          is_internal: true,
          members: [],
        };
      }
    }

    if (newStep.quorum > newStep.group.members.length) {
      newStep.quorum = newStep.group.members.length;
    }

    if (newStep.quorum === 0 && newStep.group.members.length) {
      newStep.quorum = 1;
    }

    onChange(newStep);
  };

  return (
    <SelectGroupsUsers
      placeholder={t("approvalsRules:selectPlaceholder")}
      openMenuOnFocus
      groups={filteredGroups}
      members={filteredUsers}
      hasReachMaxLength={step.group.members.length === MAX_MEMBERS}
      renderIfDisabled={renderIfDisabled}
      value={resolveSelectValue(step, groups, users)}
      onChange={handleChangeSelect}
      {...p}
    />
  );
};

function filterAvailableOptions(
  rule: RuleMultiAuth,
  step: RuleMultiAuthStep,
  groups: Group[],
  users: User[],
) {
  const usedGroupIDS = {};
  const usedUserIDS = {};
  rule.data.forEach(s => {
    if (!s) return;
    if (s.group.is_internal) {
      s.group.members.forEach(user => {
        if (
          step.group.is_internal &&
          step.group.members.find(u => u.id === user.id)
        )
          return;
        usedUserIDS[user.id] = true;
      });
    } else if (
      !s.group.is_internal &&
      !(!step.group.is_internal && step.group.id === s.group.id)
    ) {
      usedGroupIDS[s.group.id] = true;
    }
  });
  return [
    groups.filter(g => !(g.id.toString() in usedGroupIDS)),
    users.filter(g => !(g.id.toString() in usedUserIDS)),
  ];
}

function renderIfDisabled(item: Group | User) {
  return (
    item.last_request &&
    isRequestPending(item.last_request) && (
      <EntityStatus
        request={item.last_request}
        status={item.last_request.status}
      />
    )
  );
}

function resolveSelectValue(
  step: RuleMultiAuthStep,
  groups: Group[],
  users: User[],
) {
  const groupInGroups =
    step.group.id && groups.find(g => g.id === step.group.id);
  return {
    groups: step.group.is_internal ? [] : groupInGroups ? [groupInGroups] : [],
    members: step.group.is_internal
      ? users.filter(u => step.group.members.find(m => m.id === u.id))
      : [],
  };
}

export default SelectApprovals;
