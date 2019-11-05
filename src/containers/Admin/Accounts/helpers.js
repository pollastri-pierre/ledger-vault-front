// @flow
import intersection from "lodash/intersection";

import type {
  User,
  Group,
  TxApprovalStepCollection,
  EditApprovalStep,
} from "data/types";

export function haveRulesChangedDiff(
  newRules: TxApprovalStepCollection,
  oldRules: TxApprovalStepCollection,
) {
  let result;
  if ((!newRules && !oldRules) || newRules.length !== oldRules.length)
    return (result = true);

  newRules.forEach(rule => {
    if (rule && rule.group.is_internal) {
      const matchingRule = oldRules.find(r => {
        return r && r.group.is_internal;
      });
      if (matchingRule) {
        const oldMembersIds = matchingRule.group.members.map(
          member => member.id,
        );
        const newMemberIds = rule.group.members.map(member => member.id);

        if (
          oldMembersIds.length !== newMemberIds.length ||
          oldMembersIds.length !==
            intersection(oldMembersIds, newMemberIds).length
        ) {
          return (result = true);
        }
      }
    } else {
      const isGroupPresent = oldRules.find(r => {
        return r && rule && r.group.id === rule.group.id;
      });

      if (!isGroupPresent) {
        return (result = true);
      }
    }
  });
  return result;
}

export function resolveRules(
  editRules: EditApprovalStep[],
  groups: Group[],
  users: User[],
): TxApprovalStepCollection {
  const newRules = [];
  editRules.forEach((r, i) => {
    const { users: ruleUsers } = r;
    if (r.group_id) {
      const group = groups.find(g => g.id === r.group_id);
      if (group) {
        newRules.push({
          quorum: r.quorum,
          group,
        });
      }
    } else if (ruleUsers) {
      const members = users.filter(u => ruleUsers.indexOf(u.id) > -1);
      const group = {
        id: i,
        is_internal: true,
        members,
      };
      newRules.push({
        quorum: r.quorum,
        group,
      });
    }
  });
  return newRules;
}
