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
import type { MetaStatus } from "data/types";

export const defaultStatuses: MetaStatus[] = ["APPROVED", "PENDING"];

const statuses: MetaStatus[] = [...defaultStatuses, "ABORTED"];

function AccountsFilters(props: FieldsGroupProps) {
  const { t } = useTranslation();
  return (
    <FiltersCard title="Find accounts" subtitle="Find accounts" {...props}>
      <FieldStatuses
        statuses={statuses}
        placeholder={t("common:accountStatus")}
        queryKey="meta_status"
      />
      <FieldCurrency />
      <FieldAccountType />
      <FieldText
        title="Account name"
        queryKey="name"
        placeholder="Account name"
      />
    </FiltersCard>
  );
}

export default AccountsFilters;
