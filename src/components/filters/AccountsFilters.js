// @flow

import React from "react";
import { useTranslation } from "react-i18next";
import { useMe } from "components/UserContextProvider";

import {
  FiltersCard,
  FieldText,
  FieldCurrency,
  FieldAccount,
  FieldAccountType,
  FieldStatuses,
  FieldGroup,
  FieldUser,
} from "components/filters";
import type { FieldsGroupProps } from "components/filters/types";
import type { MetaStatus } from "data/types";

export const defaultStatuses: MetaStatus[] = ["APPROVED", "PENDING"];

const statuses: MetaStatus[] = [...defaultStatuses, "ABORTED"];

function AccountsFilters(props: FieldsGroupProps) {
  const { t } = useTranslation();
  const me = useMe();
  return (
    <FiltersCard title="Find accounts" subtitle="Find accounts" {...props}>
      <FieldStatuses
        statuses={statuses}
        placeholder={t("common:status")}
        queryKey="meta_status"
      />
      <FieldCurrency />
      <FieldAccountType />
      {me.role === "ADMIN" && <FieldGroup />}
      {me.role === "ADMIN" && <FieldUser />}
      <FieldText
        title="Account name"
        queryKey="name"
        placeholder="Account name"
      />
      <FieldAccount queryKey="parent" title="Parent account" />
    </FiltersCard>
  );
}

export default AccountsFilters;
