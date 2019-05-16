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
const statuses: GroupStatus[] = [...defaultStatuses, "REVOKED"];

export default function GroupsFilters(props: FieldsGroupProps) {
  const { t } = useTranslation();
  return (
    <FiltersCard title="Find groups" subtitle="Find groups" {...props}>
      <FieldStatuses
        statuses={statuses}
        placeholder={t("common:groupStatus")}
      />
      <FieldText title="Name" queryKey="name" placeholder="Group name" />
      <FieldMembers />
    </FiltersCard>
  );
}
