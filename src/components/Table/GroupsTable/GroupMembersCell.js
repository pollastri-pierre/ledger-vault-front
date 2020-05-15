// @flow

import React from "react";
import { useTranslation } from "react-i18next";

import NotApplicableText from "components/base/NotApplicableText";

import type { User } from "data/types";

type GroupMembersCellProps = {
  members: User[],
};

export default function GroupMembersCell(props: GroupMembersCellProps) {
  const { members } = props;
  const memberSubset = members.slice(0, 3);
  const remainingMembers = members.length - memberSubset.length;
  const { t } = useTranslation();

  let content = memberSubset.map((u) => u.username).join(", ");

  if (remainingMembers) {
    content += t("group:groupTable.remainingMembers", {
      count: remainingMembers,
    });
  }

  return members.length > 0 ? content : <NotApplicableText />;
}
