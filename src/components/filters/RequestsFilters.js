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
import type { RequestStatus } from "data/types";

export const defaultStatuses: RequestStatus[] = [
  "APPROVED",
  "PENDING_APPROVAL",
  "PENDING_REGISTRATION",
];

const statuses: RequestStatus[] = [...defaultStatuses, "ABORTED"];

export default function RequestsFilters(props: FieldsGroupProps) {
  const { t } = useTranslation();
  return (
    <FiltersCard title="Find tasks" subtitle="Find tasks" {...props}>
      <FieldStatuses
        statuses={statuses}
        placeholder={t("common:requestStatus")}
      />
      <FieldDate />
      <FieldRequestActivity />
    </FiltersCard>
  );
}
