// @flow

import React from "react";
import { useTranslation } from "react-i18next";

import {
  FiltersCard,
  FieldText,
  FieldStatuses,
  FieldMembers,
} from "components/filters";
import type { FieldsGroupProps } from "components/filters/types";
import type { GroupStatus } from "data/types";

export const defaultStatuses: GroupStatus[] = ["PENDING", "ACTIVE"];
const statuses: GroupStatus[] = [...defaultStatuses, "REVOKED", "ABORTED"];

export default function GroupsFilters(props: FieldsGroupProps) {
  const { t } = useTranslation();
  return (
    <FiltersCard title="Find groups" subtitle="Find groups" {...props}>
      <FieldStatuses
        statuses={statuses}
        placeholder={t("common:groupStatus")}
        targetType="GROUP"
      />
      <FieldText title="Group name" queryKey="name" placeholder="Group name" />
      <FieldMembers />
    </FiltersCard>
  );
}
