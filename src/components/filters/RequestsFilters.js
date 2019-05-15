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

const statuses: RequestStatus[] = [
  "APPROVED",
  "ABORTED",
  "PENDING_APPROVAL",
  "PENDING_REGISTRATION",
];

export default function RequestsFilters(props: FieldsGroupProps) {
  const { t } = useTranslation();
  return (
    <FiltersCard title="Find tasks" subtitle="Find tasks" {...props}>
      <FieldDate />
      <FieldStatuses
        statuses={statuses}
        placeholder={t("common:requestStatus")}
      />
      <FieldRequestActivity />
    </FiltersCard>
  );
}
