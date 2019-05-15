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

const statuses: AccountStatus[] = [
  "ACTIVE",
  "REVOKED",
  "MIGRATED",
  "HSM_COIN_UPDATED",
  "PENDING_CREATION_APPROVAL",
  "PENDING_UPDATE",
  "PENDING_MIGRATED",
];

function AccountsFilters(props: FieldsGroupProps) {
  const { t } = useTranslation();
  return (
    <FiltersCard title="Find accounts" subtitle="Find accounts" {...props}>
      <FieldCurrency />
      <FieldText title="Name" queryKey="name" placeholder="Name" />
      <FieldAccountType />
      <FieldStatuses
        statuses={statuses}
        placeholder={t("common:accountStatus")}
      />
      <FieldText title="Account ID" queryKey="id" placeholder="Account ID" />
    </FiltersCard>
  );
}

export default AccountsFilters;
