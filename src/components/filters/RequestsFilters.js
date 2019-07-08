// @flow

import React from "react";
import { useTranslation } from "react-i18next";

import {
  FiltersCard,
  FieldStatuses,
  FieldRequestActivity,
  FieldDate,
} from "components/filters";
import type { FieldsGroupProps } from "components/filters/types";
import type { MetaStatus } from "data/types";

export const defaultStatuses: MetaStatus[] = [];

const statuses: MetaStatus[] = [
  ...defaultStatuses,
  "APPROVED",
  "PENDING",
  "ABORTED",
];

export default function RequestsFilters(props: FieldsGroupProps) {
  const { t } = useTranslation();
  return (
    <FiltersCard title="Find tasks" subtitle="Find tasks" {...props}>
      <FieldStatuses
        statuses={statuses}
        placeholder={t("common:requestStatus")}
        queryKey="meta_status"
      />
      <FieldDate />
      <FieldRequestActivity />
    </FiltersCard>
  );
}
