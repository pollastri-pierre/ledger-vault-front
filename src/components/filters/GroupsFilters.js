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

const statuses: GroupStatus[] = ["PENDING", "ACTIVE", "REVOKED"];

export default function GroupsFilters(props: FieldsGroupProps) {
  const { t } = useTranslation();
  return (
    <FiltersCard title="Find groups" subtitle="Find groups" {...props}>
      <FieldText title="Name" queryKey="name" placeholder="Group name" />
      <FieldMembers />
      <FieldStatuses
        statuses={statuses}
        placeholder={t("common:groupStatus")}
      />
    </FiltersCard>
  );
}
