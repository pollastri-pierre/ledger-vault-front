// @flow

import React from "react";
import { useTranslation } from "react-i18next";

import {
  FiltersCard,
  FieldText,
  FieldSelect,
  FieldMembers,
} from "components/filters";
import type { FieldsGroupProps } from "components/filters/types";
import type { GroupStatus } from "data/types";

type StatusOption = {
  value: GroupStatus,
  label: string,
};

const statuses: StatusOption[] = [
  { value: "PENDING", label: "Pending" },
  { value: "ACTIVE", label: "Active" },
  { value: "REVOKED", label: "Deleted" },
];

export default function GroupsFilters(props: FieldsGroupProps) {
  const { t } = useTranslation();
  return (
    <FiltersCard title="Find groups" subtitle="Find groups" {...props}>
      <FieldText title="Name" queryKey="name" placeholder="Group name" />
      <FieldMembers />
      <FieldSelect
        title="Status"
        queryKey="status"
        options={statuses}
        placeholder={t("common:groupStatus")}
      />
    </FiltersCard>
  );
}
