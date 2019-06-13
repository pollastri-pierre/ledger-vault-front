// @flow

import React from "react";
import { useTranslation } from "react-i18next";

import {
  FiltersCard,
  FieldText,
  FieldCurrency,
  FieldAccountType,
  FieldStatuses,
} from "components/filters";
import type { FieldsGroupProps } from "components/filters/types";
import type { AccountStatus } from "data/types";

export const defaultStatuses: AccountStatus[] = [
  "ACTIVE",
  "VIEW_ONLY",
  "PENDING",
  "PENDING_UPDATE",
  "PENDING_VIEW_ONLY",
  "PENDING_MIGRATED",
];

const statuses: AccountStatus[] = [...defaultStatuses, "REVOKED"];

function AccountsFilters(props: FieldsGroupProps) {
  const { t } = useTranslation();
  return (
    <FiltersCard title="Find accounts" subtitle="Find accounts" {...props}>
      <FieldStatuses
        statuses={statuses}
        placeholder={t("common:accountStatus")}
      />
      <FieldCurrency />
      <FieldText title="Name" queryKey="name" placeholder="Name" />
      <FieldAccountType />
      <FieldText title="Account ID" queryKey="id" placeholder="Account ID" />
    </FiltersCard>
  );
}

export default AccountsFilters;
