// @flow

import React from "react";
import { useTranslation } from "react-i18next";

import {
  FiltersCard,
  FieldText,
  FieldCurrency,
  FieldAccountType,
  FieldSelect,
} from "components/filters";
import type { FieldsGroupProps } from "components/filters/types";
import type { AccountStatus } from "data/types";

type StatusOption = {
  value: AccountStatus,
  label: string,
};

const statuses: StatusOption[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "REVOKED", label: "Archived" },
  { value: "MIGRATED", label: "Update required" },
  { value: "HSM_COIN_UPDATED", label: "HSM coin updated" },
  { value: "PENDING_CREATION_APPROVAL", label: "Pending creation approval" },
  { value: "PENDING_UPDATE", label: "Pending update" },
  { value: "PENDING_MIGRATED", label: "Pending migrated" },
];

function AccountsFilters(props: FieldsGroupProps) {
  const { t } = useTranslation();
  return (
    <FiltersCard title="Find accounts" subtitle="Find accounts" {...props}>
      <FieldCurrency />
      <FieldText title="Name" queryKey="name" placeholder="Name" />
      <FieldAccountType />
      <FieldSelect
        title="Status"
        queryKey="status"
        options={statuses}
        placeholder={t("common:accountStatus")}
      />
      <FieldText title="Account ID" queryKey="id" placeholder="Account ID" />
    </FiltersCard>
  );
}

export default AccountsFilters;
