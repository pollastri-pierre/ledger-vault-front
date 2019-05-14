// @flow

import React from "react";
import { useTranslation } from "react-i18next";

import {
  FiltersCard,
  FieldSelect,
  FieldRequestActivity,
  FieldDate,
} from "components/filters";
import type { FieldsGroupProps } from "components/filters/types";
import type { RequestStatus } from "data/types";

type StatusOption = {
  value: RequestStatus,
  label: string,
};

const statuses: StatusOption[] = [
  { value: "APPROVED", label: "Approved" },
  { value: "ABORTED", label: "Aborted" },
  { value: "PENDING_APPROVAL", label: "Pending approval" },
  { value: "PENDING_REGISTRATION", label: "Pending registration" },
];

export default function RequestsFilters(props: FieldsGroupProps) {
  const { t } = useTranslation();
  return (
    <FiltersCard title="Find tasks" subtitle="Find tasks" {...props}>
      <FieldDate />
      <FieldSelect
        options={statuses}
        title="Status"
        queryKey="status"
        placeholder={t("common:requestStatus")}
      />
      <FieldRequestActivity />
    </FiltersCard>
  );
}
